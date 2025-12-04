// /app/api/screentime.ts
import { NativeModules, Platform, Linking } from "react-native";

const { UsageStatsModule } = NativeModules;

export type AppUsage = {
  id: string;
  packageName: string;
  name: string;
  minutes: number;
  color?: string;
};

/**
 * 스크린타임 사용 권한 체크
 */
export async function checkScreenTimePermission(): Promise<boolean> {
  if (Platform.OS !== "android") return false;

  try {
    const has = await UsageStatsModule.hasPermission();

    if (!has) {
      Linking.openSettings();
    }

    return has;
  } catch (e) {
    console.error("스크린타임 권한 체크 오류:", e);
    return false;
  }
}

/**
 * 오늘 스크린타임 가져오기
 * 네이티브 모듈 → UsageStatsModule.getDailyUsage()
 */
async function getTodayScreenTime(): Promise<AppUsage[]> {
  if (Platform.OS !== "android") {
    console.warn("스크린타임은 Android 전용입니다.");
    return [];
  }
  try {
    const usage: AppUsage[] = await UsageStatsModule.getDailyUsage();
    return usage;
  } catch (err) {
    console.error("스크린타임 가져오는 중 오류:", err);
    return [];
  }
}

/**
 * 화면에서 사용하는 함수 이름: getAppUsageStats()
 * => 내부적으로 getTodayScreenTime() 호출
 */
export const getAppUsageStats = getTodayScreenTime;
