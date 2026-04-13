import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Habit } from "@/src/types";
import { getHabits } from "@/src/storage/storage";

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


  return (
  
  );
}

const styles = StyleSheet.create({

});
