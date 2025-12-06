import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import api from "../api/apiconfig";
import { Moon, Clock, Smartphone, Coffee } from "lucide-react-native";
import styles from "../../styles/homestyles";

export default function HomeScreen() {
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(true);

  // (추후 실제 DB와 연동할 데이터)
  const sleepData = {
    totalSleep: { hours: 7, minutes: 30 },
    sleepTime: { hours: 23, minutes: 20 },
    wakeTime: { hours: 6, minutes: 50 },
    screenTime: { hours: 2, minutes: 15 },
    caffeine: { type: "아메리카노", cups: 2, mg: 300 },
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/user/me");
      setNick(res.data.nick);
    } catch (err) {
      console.log("프로필 불러오기 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#7ab8ff" size="large" />
        <Text style={styles.loadingText}>데이터 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerWelcome}>환영합니다</Text>
          <Text style={styles.headerName}>{nick}님 🌙</Text>
        </View>

        <View style={styles.headerIconBox}>
          <Moon size={40} color="white" />
        </View>
      </View>

      {/* 오늘의 수면 리포트 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>오늘의 수면 리포트</Text>

        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <Clock size={26} color="#7ab8ff" />
            <Text style={styles.label}>총 수면시간</Text>
          </View>
          <Text style={styles.value}>
            {sleepData.totalSleep.hours}시간 {sleepData.totalSleep.minutes}분
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.smallLabel}>잠든 시간</Text>
          <Text style={styles.smallValue}>
            {sleepData.sleepTime.hours}시 {sleepData.sleepTime.minutes}분
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.smallLabel}>기상 시간</Text>
          <Text style={styles.smallValue}>
            {sleepData.wakeTime.hours}시 {sleepData.wakeTime.minutes}분
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <Smartphone size={24} color="#7ab8ff" />
            <Text style={styles.label}>스마트폰 사용</Text>
          </View>
          <Text style={styles.value}>
            {sleepData.screenTime.hours}시간 {sleepData.screenTime.minutes}분
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <Coffee size={24} color="#7ab8ff" />
            <Text style={styles.label}>카페인 섭취</Text>
          </View>
          <Text style={styles.value}>
            {sleepData.caffeine.type} / {sleepData.caffeine.cups}잔 / {sleepData.caffeine.mg}mg
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.bottomEmoji}>😴</Text>
        <Text style={styles.bottomText}>좋은 밤 되세요!</Text>
      </View>
    </ScrollView>
  );
}
