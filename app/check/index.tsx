import { getChecksByDate, getHabits } from "@/src/storage/storage";
import { Habit } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkStates, setCheckStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const getTodayString = (): string => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
  };

  useEffect(() => {
    loadData();
  }, []);

  // funzione per caricare i dati all'apertura

  const loadData = async () => {
    const allHabits = await getHabits();
    const todayString = getTodayString();
    const todayChecks = await getChecksByDate(todayString);

    // crea oggetto, per ogni habit, è checkata?
    const initialCheckStates: Record<string, boolean> = {};
    for (const habit of allHabits) {
      const isChecked = todayChecks.some((check) => check.habitId === habit.id);
      initialCheckStates[habit.id] = isChecked;
    }

    setHabits(allHabits);
    setCheckStates(initialCheckStates);
    setLoading(false);
  };

  // funzione toggle checkbox in UI
  const toggleHabitCheck = (habitId: string) => {
    setCheckStates((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dettaglio Abitudine</Text>
      <Text style={styles.subtext}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
  },
  subtext: {
    color: "#888888",
    fontSize: 14,
    marginTop: 8,
  },
});
