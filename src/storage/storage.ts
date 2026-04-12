import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "../types";

const HABITS_KEY = "@habits";

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

export async function save(params: type) {}
