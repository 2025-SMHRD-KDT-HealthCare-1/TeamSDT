// app/(tabs)/home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Moon, Clock, Coffee, Smartphone, TrendingUp } from "lucide-react-native";
import styles from "../../styles/homestyles";
import api from "../api/apiconfig";

export default function HomeScreen() {
  const [nick, setNick] = useState<string>("사용자");

  // 실제 서버에서 수면/기상/섭취 정보를 불러올 경우 API 연동하면 됨
  const sleepData = {
    totalSleep: { hours: 7, minutes: 30 },
    sleepTime: { hours: 23, minutes: 20 },
    wakeTime: { hours: 6, minutes: 50 },
    screenTime: { hours: 2, minutes: 15 },
    caffeine: {
      items: [{ type: "아메리카노", cups: 2, mg: 300 }],
    },
    quality: "좋음" as "좋음" | "보통" | "나쁨",
  };

  const qualityColors = {
    좋음: "#10b981",
    보통: "#f59e0b",
    나쁨: "#ef4444",
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setNick(res.data.nick); // 🔥 DB 구조에 맞게 nick 사용
    } catch (error) {
      console.log("유저 정보 불러오기 실패:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>환영합니다</Text>
          <Text style={styles.username}>{nick}님!</Text> {/* 🔥 nick 기반 */}
        </View>

        <View style={styles.headerIconBox}>
          <Moon size={32} color="#fff" />
        </View>
      </View>

      {/* 오늘의 수면 리포트 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>오늘의 수면 리포트</Text>
        </View>

        <View style={styles.cardBody}>
          {/* 총 수면시간 */}
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <Clock size={26} color="#2d3e82" />
              </View>

              <View>
                <Text style={styles.label}>총 수면시간</Text>
                <Text style={styles.mainValue}>
                  {sleepData.totalSleep.hours}시간 {sleepData.totalSleep.minutes}분
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.qualityBadge,
                { backgroundColor: qualityColors[sleepData.quality] },
              ]}
            >
              <Text style={styles.qualityText}>{sleepData.quality}</Text>
            </View>
          </View>

          {/* 잠든 시간 / 기상 시간 */}
          <View style={styles.timeBox}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>잠든 시간</Text>
              <Text style={styles.timeValue}>
                {sleepData.sleepTime.hours}시 {sleepData.sleepTime.minutes}분
              </Text>
            </View>

            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>기상 시간</Text>
              <Text style={styles.timeValue}>
                {sleepData.wakeTime.hours}시 {sleepData.wakeTime.minutes}분
              </Text>
            </View>
          </View>

          {/* 스마트폰 사용 */}
          <View style={styles.statItem}>
            <Smartphone size={22} color="#2d3e82" />
            <Text style={styles.statLabel}>스마트폰 사용</Text>
            <Text style={styles.statValue}>
              {sleepData.screenTime.hours}시간 {sleepData.screenTime.minutes}분
            </Text>
          </View>

          {/* 카페인 섭취 */}
          <View style={styles.statItem}>
            <Coffee size={22} color="#2d3e82" />
            <Text style={styles.statLabel}>카페인 섭취</Text>
            <Text style={styles.statValue}>
              {sleepData.caffeine.items[0].type} / {sleepData.caffeine.items[0].cups}잔 /{" "}
              {sleepData.caffeine.items[0].mg}mg
            </Text>
          </View>
        </View>
      </View>

      {/* AI 분석 */}
      <View style={styles.aiCard}>
        <View style={styles.aiRow}>
          <View style={styles.aiIconCircle}>
            <TrendingUp size={28} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>AI 분석</Text>
            <Text style={styles.aiText}>
              새벽 스마트폰 사용으로 수면 지연이 발생했습니다.{"\n"}
              카페인은 최소 수면 6시간 전 섭취를 권장드립니다.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.aiButton}>
          <Text style={styles.aiButtonText}>정밀 분석 듣기 🔊</Text>
        </TouchableOpacity>
      </View>

      {/* 캐릭터 */}
      <View style={styles.bottomCharacter}>
        <Text style={styles.characterEmoji}>😴</Text>
        <Text style={styles.bottomMessage}>오늘도 편안한 하루 되세요!</Text>
      </View>
    </ScrollView>
  );
}
