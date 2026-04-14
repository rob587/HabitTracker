import { saveHabit } from "@/src/storage/storage";
import { Habit } from "@/src/types";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  // funzione per generare id Univoci

  const generateId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    return `habit_${timestamp}_${random}`;
  };

  // funzione per salvare ID

  const handleSave = async () => {
    if (name.trim() === "") {
      Alert.alert("Errore", "Inserire il nome è obbligatorio");
      return;
    }

    // preparazione del nuovo oggetto Abitudine

    const newHabit: Habit = {
      id: generateId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      color: selectedColor,
      icon: selectedIcon,
      reminder: reminder.trim() === "" ? undefined : reminder.trim(),
    };

    try {
      await saveHabit(newHabit);
      router.back();
    } catch (error) {
      Alert.alert("Errore', 'impossibile salvare l'abitudine");
      console.error(error);
    }
  };

  // funzione di cancellazione
  const handleCancel = () => {
    router.back();
  };

  <ScrollView>
    <Text>Nome abitudine</Text>
    <TextInput
      placeholder="Es. Correre, Leggere, Meditare"
      placeholderTextColor="#666"
      value={name}
      onChangeText={setName}
      autoFocus
    />

    {/* selettore colore */}

    <Text>Colore</Text>
    <View>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => {
            setSelectedColor;
          }}
        />
      ))}
    </View>

    {/* Selettore Icona */}

    <Text>Icona</Text>
    <View>
      {icons.map((icon) => (
        <TouchableOpacity key={icon} onPress={() => setSelectedIcon(icon)}>
          <Text>{icon}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>;

  return (
    <View>
      <Text>CIAO</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
