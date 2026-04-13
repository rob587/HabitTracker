import { StyleSheet, Text, View, Alert } from "react-native";
import { useState } from "react";
import { Habit } from "@/src/types";
import { deleteHabit, getHabits } from "@/src/storage/storage";

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


  return (
  
  );
}

const styles = StyleSheet.create({

});
