import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Abitudini",
          tabBarIcon: () => <Text>⭐</Text>,
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          title: "Heatmap",
          tabBarIcon: () => <Text>📊</Text>,
        }}
      />
    </Tabs>
  );
}
