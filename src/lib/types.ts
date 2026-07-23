export type Task = {
  id: string;
  text: string;
  createdAt: number;
  done: boolean;
  /** ISO date (YYYY-MM-DD) the task is scheduled for, or null if unscheduled. */
  dueDate: string | null;
  /** Time of day (HH:MM), or null if only a date (or nothing) is set. */
  dueTime: string | null;
  /** Estimated duration in minutes, or null if not set. */
  durationMinutes: number | null;
  /** True once soft-deleted into the Archive. */
  archived: boolean;
  /** Timestamp the task was archived at, or null if not archived. */
  archivedAt: number | null;
};
