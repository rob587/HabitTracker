export type Habit = {
  id: string;
  name: string;
  createdAt: string;
  color: string;
  icon: string;
  reminder?: string;
};

export type Check = {
  habitId: string;
  date: string;
  completed: boolean;
};
