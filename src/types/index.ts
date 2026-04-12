export type Habit = {
  id: number;
  name: string;
  createdAt: string;
  reminder?: number;
};

export type Check = {
  habitId: number;
  date: number;
  completed: boolean;
};
