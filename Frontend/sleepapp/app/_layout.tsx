import { Stack, Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api/apiconfig";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const res = await api.get("/user/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.user_id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

      } catch (err) {
        console.log("토큰 오류:", err);
        setIsLoggedIn(false);
        await AsyncStorage.removeItem("token");
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="join" />
      <Stack.Screen name="find-id" />
      <Stack.Screen name="find-pw" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
