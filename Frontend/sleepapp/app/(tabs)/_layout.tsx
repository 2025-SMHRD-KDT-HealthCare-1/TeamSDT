import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="measure" />
      <Tabs.Screen name="result" />
      <Tabs.Screen name="habits" />
      <Tabs.Screen name="mypage" />
    </Tabs>
  );
}
