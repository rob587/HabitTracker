import { getHabits } from "@/src/storage/storage";
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

  return (
    <View>
      <Text>[id]</Text>
    </View>
  );
};

export default HeatMapScreen;

const styles = StyleSheet.create({});
