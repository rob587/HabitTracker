import { getChecks, getHabits } from "@/src/storage/storage";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function HeatmapScreen() {
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<Map<string, number>>(
    new Map(),
  );
  const [totalHabits, setTotalHabits] = useState(0);

  const loadHeatmap = async () => {
    try {
      const habits = await getHabits();
      const checks = await getChecks();

      setTotalHabits(habits.length);

      // Crea una mappa: data -> numero di check completati

      const checkCountMap = new Map<string, number>();

      for (const check of checks) {
        const date = check.date.split("T")[0];
        const currentCount = checkCountMap.get(date) || 0;
        checkCountMap.set(date, currentCount + 1);
      }
      // Calcola percentuali per ogni giorno degli ultimi 180 giorni
      const percentages = new Map<string, number>();
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      for (let i = 0; i < 100; i++) {
        const date = new Date(today);
        date.setUTCDate(today.getUTCDate() - i);
        const dateKey = date.toISOString().split("T")[0];

        if (totalHabits > 0) {
          const completedCount = checkCountMap.get(dateKey) || 0;
          const percentage = (completedCount / totalHabits) * 100;
          percentages.set(dateKey, percentage);
        } else {
          percentages.set(dateKey, 0);
        }
      }

      setHeatmapData(percentages);
    } catch (error) {
      console.error("Errore nel caricare la heatmap:", error);
      Alert.alert("Errore", "Non è stato possibile caricare la heatmap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeatmap();
  }, []);

  // colori in base alla percentuale
  const getColorForPercentage = (percentage: number): string => {
    if (percentage === 0) return "#2A2A3A";
    if (percentage <= 25) return "rgba(16, 185, 129, 0.25)";
    if (percentage <= 50) return "rgba(16, 185, 129, 0.50)";
    if (percentage <= 75) return "rgba(16, 185, 129, 0.75)";
    return "#10B981";
  };

  const formDate = (dateKey: string): string => {
    const [year, month, day] = dateKey.split("-");
    return `${day}/${month}/${year}`;
  };

  const getDayOfWeek = (dateKey: string): number => {
    const date = new Date(dateKey);
    return date.getUTCDay();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Heatmap</Text>
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
});
