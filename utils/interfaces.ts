export enum HabitType {
  Basic = "Basic",
  Cue = "Cue",
  Duo = "Duo",
}

export interface Habit {
  userId: string;
  habitId: string;
  type: HabitType;
  title: string;
  description: string;
  streak: number;
  cue: string | null;
  partnerUserId: string | null;
  createdDate: string; // ISO date string
  lastPerformed: string; // ISO date string
}
