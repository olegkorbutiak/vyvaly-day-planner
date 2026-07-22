import { NextResponse } from "next/server";
import { addDaysISO, todayISO } from "@/lib/date-utils";

const DEFAULT_MODEL = "nvidia/nemotron-nano-9b-v2:free";
const MAX_ATTEMPTS = 2;

const SYSTEM_PROMPT =
  "Ти розбираєш нотатку користувача українською мовою на окремі конкретні задачі. " +
  'Поверни лише JSON-об\'єкт форми {"tasks": [{"title": "...", "date": "today"}]}. ' +
  '"title" — коротке формулювання задачі у наказовому стилі, без слів "сьогодні"/"завтра"/"післязавтра" всередині, без нумерації. ' +
  '"date" — одне з: "today" (якщо прямо сказано "сьогодні"), "tomorrow" (якщо "завтра"), ' +
  '"day_after_tomorrow" (якщо "післязавтра"), або "none" (якщо дату не вказано). ' +
  "КРИТИЧНО ВАЖЛИВО: не вигадуй жодних дій, яких немає в тексті користувача. Кожна задача має відповідати " +
  "конкретній дії, згаданій у вхідному тексті — нічого не додавай і не змінюй суть. " +
  "Усі назви задач пиши українською мовою — тією ж, що й вхідний текст, без перекладу.";

const EXAMPLE_INPUT =
  "Сьогодні треба попрацювати над звітом, завтра купити хліб, а післязавтра відвезти документи в банк";
const EXAMPLE_OUTPUT = JSON.stringify({
  tasks: [
    { title: "Попрацювати над звітом", date: "today" },
    { title: "Купити хліб", date: "tomorrow" },
    { title: "Відвезти документи в банк", date: "day_after_tomorrow" },
  ],
});

type RelativeDate = "today" | "tomorrow" | "day_after_tomorrow" | "none";
type ParsedTask = { title: string; date: RelativeDate };

function isRelativeDate(value: unknown): value is RelativeDate {
  return value === "today" || value === "tomorrow" || value === "day_after_tomorrow" || value === "none";
}

async function requestTasks(apiKey: string, model: string, text: string): Promise<ParsedTask[]> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: EXAMPLE_INPUT },
        { role: "assistant", content: EXAMPLE_OUTPUT },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) return [];

  const data = await response.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return [];
  }

  const tasks = (parsed as { tasks?: unknown })?.tasks;
  if (!Array.isArray(tasks)) return [];

  return tasks
    .filter((t): t is { title: unknown; date: unknown } => typeof t === "object" && t !== null)
    .filter((t) => typeof t.title === "string" && t.title.trim())
    .map((t) => ({
      title: (t.title as string).trim(),
      date: isRelativeDate(t.date) ? t.date : "none",
    }));
}

function toDueDate(date: RelativeDate): string | null {
  const today = todayISO();
  if (date === "today") return today;
  if (date === "tomorrow") return addDaysISO(today, 1);
  if (date === "day_after_tomorrow") return addDaysISO(today, 2);
  return null;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY не налаштований на сервері" },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Порожній текст" }, { status: 400 });
  }

  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  let tasks: ParsedTask[] = [];
  for (let attempt = 0; attempt < MAX_ATTEMPTS && tasks.length === 0; attempt++) {
    tasks = await requestTasks(apiKey, model, text);
  }

  if (tasks.length === 0) {
    return NextResponse.json({ error: "AI не зміг розпізнати задачі" }, { status: 502 });
  }

  return NextResponse.json({
    tasks: tasks.map((t) => ({ title: t.title, dueDate: toDueDate(t.date) })),
  });
}
