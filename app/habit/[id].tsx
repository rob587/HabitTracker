import { deleteHabit, getHabits, updateHabit } from "@/src/storage/storage";
import { Habit } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

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

  return (
    <View>
      <Text>[id]</Text>
    </View>
  );
};

export default HeatMapScreen;

const styles = StyleSheet.create({});
