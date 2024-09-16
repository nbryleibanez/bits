export enum HabitType {
  Basic = "basic",
  Cue = "cue",
  Duo = "duo",
}

export interface Habit {
  user_id: string;
  habit_id: string;
  type: HabitType;
  title: string;
  streak: number;
  cue: string | null;
  participants: object[];
  created_date: string; // ISO date string
}
