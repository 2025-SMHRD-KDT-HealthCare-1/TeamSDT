import { NativeModules, Platform } from "react-native";

const { ScreenTime } = NativeModules;
export const getTodayScreenTime = async (): Promise<number> => {
  if (Platform.OS !== "android") {
    console.warn("스크린타임 API는 Android에서만 동작합니다.");
    return 0;
  }

  try {
    const timeMs = await ScreenTime.getTodayScreenTime();
    return Math.floor(timeMs / 1000);
  } catch (error) {
    console.log("ScreenTime API Error:", error);
    return 0;
  }
};

export interface AppUsage {
  name: string;
  packageName: string;
  minutes: number;
  id?: string;
  color?: string;
}


export const getAppUsageStats = async (): Promise<AppUsage[]> => {
  if (Platform.OS !== "android") {
    console.warn("앱별 스크린타임 API는 Android에서만 동작합니다.");
    return [];
  }

  try {
    const result = await ScreenTime.getAppUsageStats(); // ← Java 모듈에서 구현되어야 함
    return result;
  } catch (error) {
    console.log("AppUsageStats Error:", error);
    return [];
  }
};

export default {
  getTodayScreenTime,
  getAppUsageStats,
};
