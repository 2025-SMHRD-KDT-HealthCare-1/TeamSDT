import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Clock, Coffee, Smartphone, Moon, TrendingUp, Volume2 } from "lucide-react-native";
import styles from "../../styles/homestyles";

interface HomePageProps {
  userName: string;
}

export default function HomePage({ userName }: HomePageProps) {
  const sleepData = {
    totalSleep: { hours: 7, minutes: 30 },
    sleepTime: { hours: 23, minutes: 20 },
    wakeTime: { hours: 6, minutes: 50 },
    screenTime: { hours: 2, minutes: 15 },
    caffeine: {
      items: [{ type: "아메리카노", amount: 150, cups: 2 }],
      totalMg: 300,
    },
    quality: "좋음" as "좋음" | "보통" | "나쁨",
  };

  const qualityColors = {
    좋음: { backgroundColor: "#10b981", color: "white" },
    보통: { backgroundColor: "#f59e0b", color: "white" },
    나쁨: { backgroundColor: "#ef4444", color: "white" },
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>환영합니다</Text>
          <Text style={styles.userName}>{userName}님!</Text>
        </View>

        <View style={styles.headerIcon}>
          <Moon size={40} color="white" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>오늘의 수면 리포트</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Clock size={26} color="#2d3e82" />
              </View>
              <View>
                <Text style={styles.label}>총 수면시간</Text>
                <Text style={styles.value}>
                  {sleepData.totalSleep.hours}시간 {sleepData.totalSleep.minutes}분
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.badge,
                { backgroundColor: qualityColors[sleepData.quality].backgroundColor },
              ]}
            >
              <Text style={{ color: "white" }}>{sleepData.quality}</Text>
            </View>
          </View>

          <View style={styles.timeGrid}>
            <View style={styles.timeBox}>
              <Text style={styles.label}>잠 든 시간</Text>
              <Text style={styles.value}>
                {sleepData.sleepTime.hours}시 {sleepData.sleepTime.minutes}분
              </Text>
            </View>

            <View style={styles.timeBox}>
              <Text style={styles.label}>기상 시간</Text>
              <Text style={styles.value}>
                {sleepData.wakeTime.hours}시 {sleepData.wakeTime.minutes}분
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Smartphone size={22} color="#2d3e82" />
              <Text style={styles.infoLabel}>스마트폰 사용</Text>
            </View>
            <Text style={styles.infoValue}>
              {sleepData.screenTime.hours}시간 {sleepData.screenTime.minutes}분
            </Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Coffee size={22} color="#2d3e82" />
              <Text style={styles.infoLabel}>카페인 섭취</Text>
            </View>
            <Text style={styles.infoValue}>
              {sleepData.caffeine.items[0].type} / {sleepData.caffeine.items[0].cups}
              잔 / {sleepData.caffeine.totalMg}mg
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.aiCard}>
        <View style={styles.row}>
          <View style={styles.aiIcon}>
            <TrendingUp size={26} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>AI 분석</Text>
            <Text style={styles.aiText}>
              전날 새벽 1시까지 스마트폰 사용으로 인한 수면 지연과{"\n"}
              카페인 섭취 시간으로 인한 수면 질 저하{"\n"}
              카페인은 수면 6시간 전 섭취를 권장합니다.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.aiButton}>
          <Volume2 size={20} color="white" />
          <Text style={styles.aiButtonText}>정밀 분석 듣기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.characterBox}>
        <Text style={styles.characterEmoji}>😴</Text>
        <Text style={styles.characterText}>좋은 하루 되세요!</Text>
      </View>
    </ScrollView>
  );
}
