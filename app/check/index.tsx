import { getChecksByDate, getHabits, toggleCheck } from "@/src/storage/storage";
import { Habit } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const checkExists = async (
    habitId: string,
    date: string,
  ): Promise<boolean> => {
    const todayChecks = await getChecksByDate(date);
    return todayChecks.some((check) => check.habitId === habitId);
  };

  const handleSave = async () => {
    const todayString = getTodayString();

    // Per ogni abitudine, applica lo stato UI
    for (const habit of habits) {
      const shouldBeChecked = checkStates[habit.id];
      const isCurrentlyChecked = await checkExists(habit.id, todayString);

      // Solo se lo stato UI è diverso dallo stato reale, fai il toggle
      if (shouldBeChecked !== isCurrentlyChecked) {
        await toggleCheck(habit.id, todayString);
      }
    }

    router.back();
  };

  const renderItem = ({ item }: { item: Habit }) => (
    <View style={styles.row}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.habitName}>{item.name}</Text>
      <Switch
        value={checkStates[item.id] || false}
        onValueChange={() => toggleHabitCheck(item.id)}
        trackColor={{ false: "#2A2A3A", true: "#6366F1" }}
        thumbColor={"#FFFFFF"}
      />
    </View>
  );

  // funzione per formattare la data
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Check giornaliero</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.date}>{formatDate(getTodayString())}</Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salva</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#121212",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#6366F1",
    fontSize: 24,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  date: {
    color: "#A1A1AA",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
  },
  habitName: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: "#6366F1",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
