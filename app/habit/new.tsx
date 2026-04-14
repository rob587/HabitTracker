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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome abitudine</Text>
      <TextInput
        style={styles.input}
        placeholder="Es. Correre, Leggere, Meditare"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        autoFocus
      />

      {/* selettore colore */}

      <Text style={styles.label}>Colore</Text>
      <View style={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => {
              setSelectedColor(color);
            }}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.colorSelected,
            ]}
          />
        ))}
      </View>

      {/* Selettore Icona */}

      <Text style={styles.label}>Icona</Text>
      <View style={styles.iconContainer}>
        {icons.map((icon) => (
          <TouchableOpacity
            key={icon}
            style={[
              styles.iconButton,
              selectedIcon === icon && styles.iconSelected,
            ]}
            onPress={() => setSelectedIcon(icon)}
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
        value={reminder}
        onChangeText={setReminder}
      />
      <Text style={styles.hint}>
        Inserisci l'orario in formato 24h. Es: 09:00 o 18:30
      </Text>

      {/* Pulsanti annulla-salva */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}> Annulla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salva</Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 40,
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
  hint: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  buttonContainer: {
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
  saveButton: {
    flex: 1,
    backgroundColor: "#6366F1",
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
