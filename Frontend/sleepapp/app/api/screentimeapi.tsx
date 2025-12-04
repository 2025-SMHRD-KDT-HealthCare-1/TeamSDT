import { NativeModules, Platform } from 'react-native';

const { UsageStatsModule } = NativeModules;

export type AppUsage = {
  id : string;
  packageName: string;
  name: string;
  minutes: number;
  color: string;
};

/**
 * @returns
 */
export async function getAppUsageStats(): Promise<AppUsage[]> {
  if (Platform.OS !== 'android') {
    console.warn('스크린타임 API는 Android에서만 지원됩니다.');
    return [];
  }

  try {
    const usageStats: AppUsage[] = await UsageStatsModule.getUsageStats();
    return usageStats;
  } catch (error) {
    console.error('스크린타임 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
}

export default function handler(req, res) {
  res.status(200).json({ message: "ScreenTime API OK" });
}