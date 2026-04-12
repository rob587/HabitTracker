import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types";

const HABITS_KEY = "@habits";

// TUTTE LE FUNZIONALITà DI HABITS
export async function getHabits(): Promise<Habit[]> {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);

    if (data === null) {
      return [];
    }

    return JSON.parse(data) as Habit[];
  } catch (error) {
    console.error("Errore nel recuperare le Abitudini:", error);
    return [];
  }
}

export async function saveHabit(habit: Habit): Promise<void> {
  try {
    const existingHabits = await getHabits();
    const updatedHabits = [...existingHabits, habit];
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
  } catch (error) {
    console.error("Errore nel salvare Abitudine", error);
  }
}

export async function updateHabit(
  id: string,
  updatedHabit: Habit,
): Promise<void> {
  try {
    const existingHabits = await getHabits();
    const index = existingHabits.findIndex((habit) => habit.id === id);

    if (index === -1) {
      console.warn(`Abitudine con id ${id} non trovata`);
      return;
    }

    const updatedHabits = [...existingHabits];
    updatedHabits[index] = updatedHabit;

    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
  } catch (error) {
    console.error("Errore nell'aggiornare l'abitudine", error);
  }
}
