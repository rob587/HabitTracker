import {
  deleteHabit,
  getCheckByHabit,
  getHabits,
  updateHabit,
} from "@/src/storage/storage";
import { Habit } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const HeatMapScreen = () => {
  const { id } = useLocalSearchParams();
  const habitId = id as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Stato per la modifica
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editReminder, setEditReminder] = useState("");

  // Statistiche
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [recentChecks, setRecentChecks] = useState<Map<string, boolean>>(
    new Map(),
  );

  const colors = [
    "#6366F1",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];
  const icons = [
    "🏃",
    "📚",
    "💪",
    "🧘",
    "🍎",
    "💧",
    "🛌",
    "🎯",
    "🧠",
    "🎨",
    "🎵",
    "🧹",
  ];

  // carica i dati dell'abitudine

  const loadHabitData = async () => {
    try {
      setLoading(true);
      const habits = await getHabits();
      const foundHabit = habits.find((h) => h.id === habitId);

      if (!foundHabit) {
        Alert.alert("Errore", "Abitudine non trovata");
        router.back();
        return;
      }

      setHabit(foundHabit);
      setEditName(foundHabit.name);
      setEditColor(foundHabit.color);
      setEditIcon(foundHabit.icon);
      setEditReminder(foundHabit.reminder || "");

      const checks = await getCheckByHabit(habitId);
      await calculateStats(foundHabit, checks);
      await calculateRecentChecks(checks);
    } catch (error) {
      console.error("Errore nel caricare i dettagli:", error);
      Alert.alert("Errore", "Non è stato possibile caricare i dettagli");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async (habit: Habit, checks: any[]) => {
    if (checks.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      setCompletionRate(0);
      return;
    }

    const checksDates = new Set(checks.map((c) => c.date.split("T")[0]));

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateKey = currentDate.toISOString().split("T")[0];
      if (checksDates.has(dateKey)) {
        streak++;
        currentDate.setUTCDate(currentDate.getUTCDate() - 1);
      } else {
        break;
      }
    }
    setCurrentStreak(streak);

    // Calcola longest streak (massimo storico)
    if (checks.length > 0) {
      const sortedChecks = [...checks].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      let maxStreak = 0;
      let currentMaxStreak = 1;

      for (let i = 1; i < sortedChecks.length; i++) {
        const prevDate = new Date(sortedChecks[i - 1].date);
        const currDate = new Date(sortedChecks[i].date);
        const diffDays = Math.round(
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          currentMaxStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentMaxStreak);
          currentMaxStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentMaxStreak);
      setLongestStreak(maxStreak);
    }

    // Calcola completion rate (dal giorno di creazione a oggi)
    const createdDate = new Date(habit.createdAt);
    createdDate.setUTCHours(0, 0, 0, 0);
    const todayDate = new Date(today);

    const daysSinceCreation = Math.max(
      1,
      Math.round(
        (todayDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    const rate = (checks.length / daysSinceCreation) * 100;
    setCompletionRate(Math.min(100, Math.round(rate)));
  };

  // Calcola check degli ultimi 30 giorni per la mini heatmap
  const calculateRecentChecks = async (checks: any[]) => {
    const checkedDates = new Set(checks.map((c) => c.date.split("T")[0]));
    const recentMap = new Map<string, boolean>();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      recentMap.set(dateKey, checkedDates.has(dateKey));
    }

    setRecentChecks(recentMap);
  };

  // Salva le modifiche
  const handleSaveEdit = async () => {
    if (!habit) return;

    if (editName.trim() === "") {
      Alert.alert("Errore", "Il nome dell'abitudine è obbligatorio");
      return;
    }

    const updatedHabit: Habit = {
      ...habit,
      name: editName.trim(),
      color: editColor,
      icon: editIcon,
      reminder: editReminder.trim() === "" ? undefined : editReminder.trim(),
    };

    await updateHabit(habit.id, updatedHabit);
    setHabit(updatedHabit);
    setIsEditing(false);
    Alert.alert("Successo", "Abitudine aggiornata con successo");
  };

  // Elimina l'abitudine
  const handleDelete = () => {
    Alert.alert(
      "Elimina abitudine",
      "Sei sicuro di voler eliminare questa abitudine? Tutti i progressi andranno persi.",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            await deleteHabit(habitId);
            router.back();
          },
        },
      ],
    );
  };

  const renderMiniHeatmap = () => {
    const days = Array.from(recentChecks.entries()).reverse();
    const weekDays = ["L", "M", "M", "G", "V", "S", "D"];

    return (
      <View style={styles.miniHeatmapContainer}>
        <Text style={styles.sectionTitle}>Ultimi 30 giorni</Text>
        <View style={styles.miniWeekHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.miniWeekdayHeader}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.miniGrid}>
          {days.map(([date, isChecked]) => (
            <View
              key={date}
              style={[
                styles.miniDayCell,
                { backgroundColor: isChecked ? "#10B981" : "#2A2A3A" },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  useEffect(() => {
    loadHabitData();
  }, [habitId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Abitudine non trovata</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!isEditing ? (
        // Modalità visualizzazione
        <>
          <View style={[styles.headerCard, { borderTopColor: habit.color }]}>
            <Text style={styles.iconLarge}>{habit.icon}</Text>
            <Text style={styles.habitNameLarge}>{habit.name}</Text>
            {habit.reminder && (
              <Text style={styles.reminderText}>⏰ {habit.reminder}</Text>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Streak attuale</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{longestStreak}</Text>
              <Text style={styles.statLabel}>Record massimo</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Completamento</Text>
            </View>
          </View>

          {renderMiniHeatmap()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>✏️ Modifica</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>🗑️ Elimina</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Modalità modifica
        <>
          <Text style={styles.editTitle}>Modifica abitudine</Text>

          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Colore</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  editColor === color && styles.colorSelected,
                ]}
                onPress={() => setEditColor(color)}
              />
            ))}
          </View>

          <Text style={styles.label}>Icona</Text>
          <View style={styles.iconContainer}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  editIcon === icon && styles.iconSelected,
                ]}
                onPress={() => setEditIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Promemoria (opzionale)</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM (es. 09:00)"
            placeholderTextColor="#666"
            value={editReminder}
            onChangeText={setEditReminder}
          />

          <View style={styles.editButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveEditButton}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveEditButtonText}>Salva</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default HeatMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  errorText: {
    color: "#EF4444",
    fontSize: 16,
  },
  headerCard: {
    backgroundColor: "#1E1E2E",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderTopWidth: 4,
    marginBottom: 24,
  },
  iconLarge: {
    fontSize: 64,
    marginBottom: 12,
  },
  habitNameLarge: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  reminderText: {
    color: "#6366F1",
    fontSize: 14,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    color: "#6366F1",
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 4,
  },
  miniHeatmapContainer: {
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  miniWeekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  miniWeekdayHeader: {
    color: "#A1A1AA",
    fontSize: 10,
    width: 28,
    textAlign: "center",
  },
  miniGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  miniDayCell: {
    width: 28,
    height: 28,
    margin: 2,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#2A2A3A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  // Stili per la modalità modifica
  editTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2A2A3A",
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#2A2A3A",
  },
  colorSelected: {
    borderColor: "#FFFFFF",
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E1E2E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2A2A3A",
  },
  iconSelected: {
    borderColor: "#6366F1",
    borderWidth: 3,
    backgroundColor: "#2A2A3A",
  },
  iconText: {
    fontSize: 28,
  },
  editButtonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#2A2A3A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveEditButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
