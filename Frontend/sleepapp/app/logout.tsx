// utils/logout.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// 🔥 로그아웃 기능 전체 담당 파일
export const logout = async () => {
  try {
    // 저장된 JWT 삭제
    await AsyncStorage.removeItem("token");

    // 필요하면 모든 스토리지 초기화 가능
    // await AsyncStorage.clear();

    console.log("로그아웃 완료");

    // 로그인 페이지로 이동
    router.replace("/");
  } catch (error) {
    console.log("로그아웃 오류:", error);
  }
};
