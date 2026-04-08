import { StyleSheet, Text, View } from "react-native";

export default function NewHabitScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aggiungi Abitudine</Text>
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
});
