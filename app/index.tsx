import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { useCallback, useState } from "react";
import { Habit } from "@/src/types";
import { deleteHabit, getHabits } from "@/src/storage/storage";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";

export default function HomeScreen() {

  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(false)


  // FUNZIONI GENERICHE PER LE ABITUDINI

  const loadHabits = async () => {
    try{
      setLoading(true)
      const habitsList = await getHabits()
      setHabits(habitsList)
    }catch(error){
      console.error('Errore nel caricare le abitudini', error)
    } finally{
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      'Elimina Abitudine',
      'Sei sicuro di voler eliminare questa abitudine?',
      [
        {text: 'Annulla', style: 'cancel'},
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(id)
            await loadHabits()
          }
        }
      ]
    )
  }


  useFocusEffect(
    useCallback(() => {
      loadHabits()
    }, [])
  )

  // SINGLE CARD RENDERING

  const renderCard = ({item}: {item: Habit}) => (
    <TouchableOpacity style={[styles.card, {borderLeftColor: item.color}]}
    onPress={() => router.push(`/habit/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.icon}>{item.icon}</Text>
        <View style={styles.cardText}>
          <Text style={styles.habitName}>{item.name}</Text>
          <Text style={styles.streak}>🔥 0 giorni</Text> 
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardText: {
    marginLeft: 12,
    flex: 1,
  },
  icon: {
    fontSize: 32,
  },
  habitName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  streak: {
    color: "#A1A1AA",
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
    color: "#EF4444",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#6366F1",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "600",
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  emptySubtext: {
    color: "#A1A1AA",
    fontSize: 14,
    marginTop: 8,
  },
});