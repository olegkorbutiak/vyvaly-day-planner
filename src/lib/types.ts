export type Task = {
  id: string;
  text: string;
  createdAt: number;
  done: boolean;
  scheduledForToday: boolean;
};
