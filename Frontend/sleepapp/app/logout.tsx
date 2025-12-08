import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");


    console.log("로그아웃 완료");

    router.replace("/");
  } catch (error) {
    console.log("로그아웃 오류:", error);
  }
};
