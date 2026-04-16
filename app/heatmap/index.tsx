import { getChecks, getHabits } from "@/src/storage/storage";
import { useState } from "react";
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

      const checkCountMap = new Map<string, number>();

      for (const check of checks) {
        const date = check.date.split("T")[0];
      }
    } catch (error) {
      console.error("Errore nel caricare la heatmap:", error);
      Alert.alert("Errore", "Non è stato possibile caricare la heatmap");
    } finally {
      setLoading(false);
    }
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
