import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dettaglio Abitudine</Text>
      <Text style={styles.subtext}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
  },
  subtext: {
    color: "#888888",
    fontSize: 14,
    marginTop: 8,
  },
});
