import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { addDaysISO } from "@/lib/date-utils";
import { googleFetch, refreshAccessToken, TIME_ZONE } from "@/lib/google-calendar";

const CALENDAR_NAME = "My Perfect Day Planner";
const DEFAULT_DURATION_MINUTES = 30;

type TaskRow = {
  id: string;
  text: string;
  done: boolean;
  due_date: string | null;
  due_time: string | null;
  duration_minutes: number | null;
  archived: boolean;
  google_event_id: string | null;
};

async function ensureCalendar(accessToken: string): Promise<string | null> {
  const response = await googleFetch(
    "https://www.googleapis.com/calendar/v3/calendars",
    accessToken,
    { method: "POST", body: JSON.stringify({ summary: CALENDAR_NAME }) },
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.id ?? null;
}

function buildEventBody(task: TaskRow) {
  if (task.due_time) {
    const durationMinutes = task.duration_minutes ?? DEFAULT_DURATION_MINUTES;
    const [h, m] = task.due_time.split(":").map(Number);
    const endMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const endDate =
      endMinutes >= 24 * 60 ? addDaysISO(task.due_date!, Math.floor(endMinutes / (24 * 60))) : task.due_date;
    return {
      summary: task.text,
      start: { dateTime: `${task.due_date}T${task.due_time}:00`, timeZone: TIME_ZONE },
      end: {
        dateTime: `${endDate}T${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`,
        timeZone: TIME_ZONE,
      },
    };
  }
  return {
    summary: task.text,
    start: { date: task.due_date },
    end: { date: addDaysISO(task.due_date!, 1) },
  };
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase не налаштований" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const taskId = typeof body?.taskId === "string" ? body.taskId : null;
  if (!taskId) return NextResponse.json({ error: "taskId відсутній" }, { status: 400 });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { data: task } = await supabase
    .from("tasks")
    .select("id, text, done, due_date, due_time, duration_minutes, archived, google_event_id")
    .eq("id", taskId)
    .maybeSingle<TaskRow>();
  if (!task) return NextResponse.json({ ok: true, skipped: "task not found" });

  const { data: tokenRow } = await supabase
    .from("user_google_tokens")
    .select("refresh_token, calendar_id")
    .eq("user_id", user.id)
    .maybeSingle<{ refresh_token: string; calendar_id: string | null }>();
  if (!tokenRow) return NextResponse.json({ ok: true, skipped: "no google token" });

  const accessToken = await refreshAccessToken(tokenRow.refresh_token);
  if (!accessToken) return NextResponse.json({ ok: false, error: "token refresh failed" });

  let calendarId = tokenRow.calendar_id;
  if (!calendarId) {
    calendarId = await ensureCalendar(accessToken);
    if (!calendarId) return NextResponse.json({ ok: false, error: "calendar creation failed" });
    await supabase.from("user_google_tokens").update({ calendar_id: calendarId }).eq("user_id", user.id);
  }

  const shouldHaveEvent = !task.archived && task.due_date;

  if (!shouldHaveEvent) {
    if (task.google_event_id) {
      await googleFetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${task.google_event_id}`,
        accessToken,
        { method: "DELETE" },
      );
      await supabase.from("tasks").update({ google_event_id: null }).eq("id", taskId);
    }
    return NextResponse.json({ ok: true });
  }

  const eventBody = buildEventBody(task);

  if (task.google_event_id) {
    const response = await googleFetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${task.google_event_id}`,
      accessToken,
      { method: "PATCH", body: JSON.stringify(eventBody) },
    );
    if (response.status === 404) {
      const created = await googleFetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        accessToken,
        { method: "POST", body: JSON.stringify(eventBody) },
      );
      const data = await created.json();
      if (data.id) await supabase.from("tasks").update({ google_event_id: data.id }).eq("id", taskId);
    }
  } else {
    const created = await googleFetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      accessToken,
      { method: "POST", body: JSON.stringify(eventBody) },
    );
    const data = await created.json();
    if (data.id) await supabase.from("tasks").update({ google_event_id: data.id }).eq("id", taskId);
  }

  return NextResponse.json({ ok: true });
}
