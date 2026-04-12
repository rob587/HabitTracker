import AsyncStorage from "@react-native-async-storage/async-storage";
import { Check, Habit } from "../types";

const HABITS_KEY = "@habits";
const CHECKS_KEY = "@checks";

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

export async function deleteHabit(id: string): Promise<void> {
  try {
    const existingHabits = await getHabits();
    const updatedHabits = existingHabits.filter((habit) => habit.id !== id);
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
  } catch (error) {
    console.error("Errore nel cancellare l'abitudine", error);
  }
}

// TUTTE LE FUNZIONI PER CHECK

export async function getChecks(): Promise<Check[]> {
  try {
    const data = await AsyncStorage.getItem(CHECKS_KEY);

    if (data === null) {
      return [];
    }

    return JSON.parse(data) as Check[];
  } catch (error) {
    console.error("Errore nel recuperare i check", error);
    return [];
  }
}

export async function saveCheck(check: Check): Promise<void> {
  try {
    const existingChecks = await getChecks();
    const updatedChecks = [...existingChecks, check];
    await AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(updatedChecks));
  } catch (error) {
    console.error("Errore nel salvare il check", error);
  }
}

export async function getCheckByHabit(habitId: string): Promise<Check[]> {
  try {
    const allChecks = await getChecks();
    return allChecks.filter((check) => check.habitId === habitId);
  } catch (error) {
    console.error("Errore nel recuperare i check per Abitudine", error);
    return [];
  }
}

export async function getChecksByDate(date: string): Promise<Check[]> {
  try {
    const allChecks = await getChecks();
    return allChecks.filter((check) => check.date === date);
  } catch (error) {
    console.error("Errore nel recuperare i check per data:", error);
    return [];
  }
}
