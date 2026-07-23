import { addDaysISO, toISODate } from "./date-utils";

export type Holiday = { date: string; name: string };

const FIXED_HOLIDAYS: { month: number; day: number; name: string }[] = [
  { month: 1, day: 1, name: "Новий рік" },
  { month: 3, day: 8, name: "Міжнародний жіночий день" },
  { month: 5, day: 1, name: "День праці" },
  { month: 5, day: 9, name: "День перемоги над нацизмом у Другій світовій війні" },
  { month: 6, day: 28, name: "День Конституції України" },
  { month: 8, day: 24, name: "День незалежності України" },
  { month: 10, day: 1, name: "День захисників і захисниць України" },
  { month: 12, day: 25, name: "Різдво Христове" },
];

/** Orthodox (Julian-calendar) Easter Sunday, converted to a Gregorian ISO date. */
function getOrthodoxEasterISO(year: number): string {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  const julian = new Date(year, month - 1, day);
  julian.setDate(julian.getDate() + 13); // Julian → Gregorian, valid for 1900–2099
  return toISODate(julian);
}

const holidayCache = new Map<number, Holiday[]>();

export function getHolidaysForYear(year: number): Holiday[] {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const fixed = FIXED_HOLIDAYS.map((h) => ({
    date: `${year}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`,
    name: h.name,
  }));
  const easter = getOrthodoxEasterISO(year);
  const pentecost = addDaysISO(easter, 49);

  const holidays = [
    ...fixed,
    { date: easter, name: "Великдень (Пасха)" },
    { date: pentecost, name: "Трійця" },
  ].sort((a, b) => a.date.localeCompare(b.date));

  holidayCache.set(year, holidays);
  return holidays;
}

export function getHolidayForDate(iso: string): Holiday | null {
  const year = Number(iso.slice(0, 4));
  return getHolidaysForYear(year).find((h) => h.date === iso) ?? null;
}
