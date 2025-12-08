import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import styles from "../styles/screentimetrackingstyles";
import { getAppUsageStats, AppUsage } from "../app/api/screentime";

export default function ScreenTimeTracking() {
  const [apps, setApps] = useState<AppUsage[]>([]);
  const [loading, setLoading] = useState(true);

  const getColorByIndex = (index: number) => {
    const colors = ["#FFD93D", "#FF1E1E", "#FF6B81", "#60A5FA", "#2ECC71"];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const loadData = async () => {
      const raw = await getAppUsageStats();

      const unique: AppUsage[] = [];
      const seen = new Set();

      raw.forEach((item) => {
        if (!item) return;
        if (item.minutes <= 0) return;
        if (seen.has(item.packageName)) return;

        seen.add(item.packageName);
        unique.push(item);
      });

      const processed = unique.map((app, index) => ({
        ...app,
        color: getColorByIndex(index),
        id: `${app.packageName}-${index}`, // ⭐ 유니크 key
      }));

      setApps(processed);
      setLoading(false);
    };

    loadData();
  }, []);

  const todayTotal = apps.reduce((sum, app) => sum + app.minutes, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#999" />
        <Text style={{ marginTop: 12 }}>스크린타임 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  if (apps.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>앱 사용 기록이 없습니다.</Text>
        <Text style={styles.noDataSubText}>사용 정보 접근 권한을 허용했는지 확인해주세요.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>오늘 총 스크린타임</Text>
        <Text style={styles.totalTime}>
          {Math.floor(todayTotal / 60)}시간 {todayTotal % 60}분
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>사용 앱</Text>

        {apps.map((app) => (
          <View key={app.id} style={styles.appRow}>
            <View style={styles.appLeft}>
              <Text style={styles.appName}>{app.name}</Text>
            </View>

            <Text style={styles.appTime}>
              {Math.floor(app.minutes / 60)}시간 {app.minutes % 60}분
            </Text>

            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: app.color,
                    width: `${(app.minutes / todayTotal) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomNotice}>
        <Text style={styles.bottomText}>📱 하루 스크린타임을 줄여보세요!</Text>
      </View>
    </ScrollView>
  );
}
