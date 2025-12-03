import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/screentimetrackingstyles";

type AppUsage = {
  id: string;
  name: string;
  minutes: number;
  color: string;
};

export default function ScreenTimeTracking() {
  // 더미 데이터 (나중에 API 연동 가능)
  const [apps] = useState<AppUsage[]>([
    { id: "1", name: "카카오톡", minutes: 65, color: "#FFD93D" }, // 노랑
    { id: "2", name: "유튜브", minutes: 120, color: "#FF1E1E" }, // 빨강
    { id: "3", name: "인스타그램", minutes: 45, color: "#FF6B81" }, // 분홍
    { id: "4", name: "크롬", minutes: 30, color: "#60A5FA" }, // 파랑
    { id: "5", name: "네이버", minutes: 25, color: "#2ECC71" }, // 초록
  ]);

  const todayTotal = apps.reduce((s, a) => s + a.minutes, 0);

  // 전날/주/달 비교 (예시)
  const yesterday = 135;
  const weekAvg = 160;
  const monthAvg = 150;

  const diff = (base: number, now: number) => {
    const c = now - base;
    if (c > 0) return { text: `${c}분 증가`, type: "up" };
    if (c < 0) return { text: `${Math.abs(c)}분 감소`, type: "down" };
    return { text: "변화 없음", type: "same" };
  };

  return (
    <View style={styles.container}>
      {/* 오늘 총 스크린타임 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>오늘 총 스크린타임</Text>
        <Text style={styles.totalTime}>{Math.floor(todayTotal / 60)}시간 {todayTotal % 60}분</Text>
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
