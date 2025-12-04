import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "../styles/screentimetrackingstyles";
import { getAppUsageStats, AppUsage } from "../app/api/screentime";

export default function ScreenTimeTracking() {
  const [apps, setApps] = useState<AppUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsageData = async () => {
      const data = await getAppUsageStats();

      // color 값이 없을 경우 랜덤 색상 지정
      const colored = data.map((app, index) => ({
        ...app,
        color: app.color || getColorByIndex(index),
        id: app.packageName || index.toString(),
      }));

      setApps(colored);
      setLoading(false);
    };

    fetchUsageData();
  }, []);

  const getColorByIndex = (index: number) => {
    const colors = ["#FFD93D", "#FF1E1E", "#FF6B81", "#60A5FA", "#2ECC71"];
    return colors[index % colors.length];
  };

  const todayTotal = apps.reduce((s, a) => s + a.minutes, 0);

  const yesterday = 135;
  const weekAvg = 160;
  const monthAvg = 150;

  const diff = (base: number, now: number) => {
    const c = now - base;
    if (c > 0) return { text: `${c}분 증가`, type: "up" };
    if (c < 0) return { text: `${Math.abs(c)}분 감소`, type: "down" };
    return { text: "변화 없음", type: "same" };
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#999" />
        <Text style={{ marginTop: 12 }}>스크린타임 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 오늘 총 스크린타임 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>오늘 총 스크린타임</Text>
        <Text style={styles.totalTime}>
          {Math.floor(todayTotal / 60)}시간 {todayTotal % 60}분
        </Text>
      </View>

      {/* 앱 리스트 */}
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

      {/* 비교 카드 */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>사용 시간 비교</Text>

        {/* 전날 대비 */}
        <View style={styles.compareRow}>
          <View style={styles.compareLeft}>
            <Text style={styles.compareIcon}>📈</Text>
            <Text style={styles.compareLabel}>전날 대비</Text>
          </View>
          <Text
            style={[
              styles.compareValue,
              diff(yesterday, todayTotal).type === "up" && styles.red,
              diff(yesterday, todayTotal).type === "down" && styles.green,
            ]}
          >
            {diff(yesterday, todayTotal).text}
          </Text>
        </View>

        {/* 이번 주 평균 대비 */}
        <View style={styles.compareRow}>
          <View style={styles.compareLeft}>
            <Text style={styles.compareIcon}>🔄</Text>
            <Text style={styles.compareLabel}>이번 주 평균 대비</Text>
          </View>
          <Text
            style={[
              styles.compareValue,
              diff(weekAvg, todayTotal).type === "up" && styles.red,
              diff(weekAvg, todayTotal).type === "down" && styles.green,
            ]}
          >
            {diff(weekAvg, todayTotal).text}
          </Text>
        </View>

        {/* 이번 달 평균 대비 */}
        <View style={styles.compareRow}>
          <View style={styles.compareLeft}>
            <Text style={styles.compareIcon}>📅</Text>
            <Text style={styles.compareLabel}>이번 달 평균 대비</Text>
          </View>
          <Text
            style={[
              styles.compareValue,
              diff(monthAvg, todayTotal).type === "up" && styles.red,
              diff(monthAvg, todayTotal).type === "down" && styles.green,
            ]}
          >
            {diff(monthAvg, todayTotal).text}
          </Text>
        </View>
      </View>

      {/* 안내 문구 */}
      <View style={styles.bottomNotice}>
        <Text style={styles.bottomText}>📱 스크린타임을 줄여보세요!</Text>
      </View>
    </View>
  );
}
