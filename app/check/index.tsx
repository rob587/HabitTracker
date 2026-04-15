import { Habit } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
