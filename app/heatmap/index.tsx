import { getChecks, getHabits } from "@/src/storage/storage";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const formatDate = (dateKey: string): string => {
    const [year, month, day] = dateKey.split("-");
    return `${day}/${month}/${year}`;
  };

  const getDayOfWeek = (dateKey: string): number => {
    const date = new Date(dateKey);
    return date.getUTCDay();
  };

  const handleDayPress = (dateKey: string, percentage: number) => {
    const completedCount =
      totalHabits > 0 ? Math.round((percentage / 100) * totalHabits) : 0;
    Alert.alert(
      formatDate(dateKey),
      `Abitudini completate: ${completedCount} / ${totalHabits}\nPercentuale: ${Math.round(percentage)}%`,
      [{ text: "OK" }],
    );
  };

  const generateGrid = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Genera array degli ultimi 180 giorni
    const days: string[] = [];
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - i);
      days.unshift(date.toISOString().split("T")[0]); // Mette in ordine crescente
    }
    const firstDate = new Date(days[0]);
    const firstDayOfWeek = firstDate.getUTCDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const emptyDays = Array(offset).fill(null);

    const weekDays = ["L", "M", "M", "G", "V", "S", "D"];

    return (
      <>
        <View>
          {/* intestazioni */}
          {weekDays.map((day, index) => (
            <Text key={index}>{day}</Text>
          ))}
        </View>
        {/* griglia giorni */}
        <View>
          {emptyDays.map((_, index) => (
            <View key={`empty-${index}`}>
              {days.map((dateKey) => {
                const percentage = heatmapData.get(dateKey) || 0;
                const color = getColorForPercentage(percentage);

                return (
                  <TouchableOpacity
                    key={dateKey}
                    onPress={() => handleDayPress(dateKey, percentage)}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </>
    );
  };

  if (loading) {
    return (
      <View>
        <Text>Caricamento heatmap...</Text>
      </View>
    );
  }

  if (totalHabits === 0) {
    return (
      <View>
        <Text>Nessuna abitudine ancora</Text>
        <Text>Aggiungi un'abitudine per vedere la heatmap</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Heatmap</Text>
      <Text style={styles.subtitle}>Progressi degli ultimi 6 mesi</Text>

      {generateGrid()}

      {/* Legenda */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legenda</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: "#2A2A3A" }]} />
          <Text style={styles.legendText}>0%</Text>

          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgba(16, 185, 129, 0.25)" },
            ]}
          />
          <Text style={styles.legendText}>1-25%</Text>

          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgba(16, 185, 129, 0.50)" },
            ]}
          />
          <Text style={styles.legendText}>26-50%</Text>
        </View>
        <View style={styles.legendRow}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgba(16, 185, 129, 0.75)" },
            ]}
          />
          <Text style={styles.legendText}>51-75%</Text>

          <View style={[styles.legendColor, { backgroundColor: "#10B981" }]} />
          <Text style={styles.legendText}>76-100%</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
  emptyText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#A1A1AA",
    fontSize: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#A1A1AA",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  weekdayHeader: {
    color: "#A1A1AA",
    fontSize: 12,
    width: 32,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayCell: {
    width: 32,
    height: 32,
    margin: 2,
    borderRadius: 6,
  },
  emptyCell: {
    width: 32,
    height: 32,
    margin: 2,
  },
  legend: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A3A",
  },
  legendTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: "#A1A1AA",
    fontSize: 12,
    marginRight: 16,
  },
});
