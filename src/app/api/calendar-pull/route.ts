import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { googleFetch, refreshAccessToken } from "@/lib/google-calendar";

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

type GoogleEvent = {
  id: string;
  status?: string;
  summary?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
};

type ExistingTaskRow = {
  id: string;
  text: string;
  due_date: string | null;
  due_time: string | null;
  duration_minutes: number | null;
  archived: boolean;
};

function eventToTaskFields(event: GoogleEvent) {
  const text = event.summary?.trim() || "(без назви)";

  if (event.start?.date) {
    return { text, dueDate: event.start.date, dueTime: null as string | null, durationMinutes: null as number | null };
  }

  if (event.start?.dateTime) {
    const [datePart, timePart] = event.start.dateTime.split("T");
    const dueTime = timePart.slice(0, 5);
    const durationMinutes = event.end?.dateTime
      ? Math.round(
          (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) / 60000,
        )
      : null;
    return { text, dueDate: datePart, dueTime, durationMinutes };
  }

  return null;
}

async function listEvents(calendarId: string, accessToken: string, syncToken: string | null) {
  const params = new URLSearchParams({ singleEvents: "true" });
  if (syncToken) {
    params.set("syncToken", syncToken);
  } else {
    params.set("timeMin", new Date(Date.now() - NINETY_DAYS_MS).toISOString());
  }

  let response = await googleFetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`,
    accessToken,
  );

  if (response.status === 410) {
    const freshParams = new URLSearchParams({
      singleEvents: "true",
      timeMin: new Date(Date.now() - NINETY_DAYS_MS).toISOString(),
    });
    response = await googleFetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${freshParams}`,
      accessToken,
    );
  }

  return response;
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase не налаштований" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { data: tokenRow } = await supabase
    .from("user_google_tokens")
    .select("refresh_token, calendar_id, calendar_sync_token")
    .eq("user_id", user.id)
    .maybeSingle<{ refresh_token: string; calendar_id: string | null; calendar_sync_token: string | null }>();
  if (!tokenRow?.calendar_id) return NextResponse.json({ ok: true, skipped: "no calendar yet" });

  const accessToken = await refreshAccessToken(tokenRow.refresh_token);
  if (!accessToken) return NextResponse.json({ ok: false, error: "token refresh failed" });

  const response = await listEvents(tokenRow.calendar_id, accessToken, tokenRow.calendar_sync_token);
  if (!response.ok) return NextResponse.json({ ok: false, error: "list events failed" });

  const data = await response.json();
  const events: GoogleEvent[] = data.items ?? [];

  for (const event of events) {
    const { data: existingTask } = await supabase
      .from("tasks")
      .select("id, text, due_date, due_time, duration_minutes, archived")
      .eq("google_event_id", event.id)
      .eq("user_id", user.id)
      .maybeSingle<ExistingTaskRow>();

    if (event.status === "cancelled") {
      if (existingTask && !existingTask.archived) {
        await supabase
          .from("tasks")
          .update({ archived: true, archived_at: new Date().toISOString() })
          .eq("id", existingTask.id);
      }
      continue;
    }

    const fields = eventToTaskFields(event);
    if (!fields) continue;

    if (existingTask) {
      const changed =
        existingTask.text !== fields.text ||
        existingTask.due_date !== fields.dueDate ||
        existingTask.due_time !== fields.dueTime ||
        existingTask.duration_minutes !== fields.durationMinutes ||
        existingTask.archived;
      if (changed) {
        await supabase
          .from("tasks")
          .update({
            text: fields.text,
            due_date: fields.dueDate,
            due_time: fields.dueTime,
            duration_minutes: fields.durationMinutes,
            archived: false,
            archived_at: null,
          })
          .eq("id", existingTask.id);
      }
    } else {
      await supabase.from("tasks").insert({
        user_id: user.id,
        text: fields.text,
        created_at: new Date().toISOString(),
        done: false,
        due_date: fields.dueDate,
        due_time: fields.dueTime,
        duration_minutes: fields.durationMinutes,
        archived: false,
        google_event_id: event.id,
      });
    }
  }

  if (data.nextSyncToken) {
    await supabase
      .from("user_google_tokens")
      .update({ calendar_sync_token: data.nextSyncToken })
      .eq("user_id", user.id);
  }

  return NextResponse.json({ ok: true, count: events.length });
}
