import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NewHabitScreen() {
  // state iniziali per il form

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#6366F1");
  const [selectedIcon, setSelectedIcon] = useState("🏃");
  const [reminder, setReminder] = useState("");

  // opzioni predefinite tra colori e icone
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

  return (
    <View>
      <Text>CIAO</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
