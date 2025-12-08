import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import api from "../api/apiconfig";
import { Moon, Clock, Smartphone, Coffee } from "lucide-react-native";
import styles from "../../styles/homestyles";
import StarsBackground from "../../components/starsbackground";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export default function HomeScreen() {
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(true);


  const sleepData = {
    user_name : { name : "홍길동"},
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
        <ActivityIndicator color="#7aa2ff" size="large" />
        <Text style={styles.loadingText}>데이터 불러오는 중...</Text>
      </View>
    );
  }

  //AI
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  async function playBase64Audio(base64Audio) {
    const fileUri = FileSystem.cacheDirectory + "ai_tts.mp3";

    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: fileUri });
    await sound.playAsync();
  }

  const loadAiFeedback = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("https://christal-nonsignificative-noneternally.ngrok-free.dev/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: nick,
          caffeine: sleepData.caffeine.mg,
          screen_time: sleepData.screenTime.hours + sleepData.screenTime.minutes / 60,
          sleep_time: sleepData.totalSleep.hours + sleepData.totalSleep.minutes / 60,
          style: "친근하게"
        }),
      });

      const data = await res.json();

      setAiText(data.text);          // 텍스트 화면 표시
      playBase64Audio(data.audio_base64); // 음성 자동 재생
    } catch (err) {
      console.log("AI 오류:", err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadAiFeedback();
    }
  }, [loading]);


  return (
    <View style={{ flex: 1, backgroundColor: "#0A0D1A" }}>

      <StarsBackground style={styles.starsContainer} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.header, { backgroundColor: "rgba(62,79,147,0.85)" }]}>
          <View>
            <Text style={styles.headerWelcome}>환영합니다</Text>
            <Text style={styles.headerName}>{nick}님 🌙</Text>
          </View>

          <View style={styles.headerIconBox}>
            <Moon size={40} color="white" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 수면 리포트</Text>

          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Clock size={26} color="#7aa2ff" />
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
              <Smartphone size={24} color="#7aa2ff" />
              <Text style={styles.label}>스마트폰 사용</Text>
            </View>
            <Text style={styles.value}>
              {sleepData.screenTime.hours}시간 {sleepData.screenTime.minutes}분
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Coffee size={24} color="#7aa2ff" />
              <Text style={styles.label}>카페인 섭취</Text>
            </View>
            <Text style={styles.value}>
              {sleepData.caffeine.type} / {sleepData.caffeine.cups}잔 / {sleepData.caffeine.mg}mg
            </Text>
          </View>
          
        </View>

        {/* AI 텍스트 출력 */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.cardTitle}>AI 수면 분석</Text>

          {aiLoading ? (
            <Text style={{ color: "#888", marginTop: 10 }}>AI 분석 중...</Text>
          ) : (
            <Text style={{ color: "white", marginTop: 10, lineHeight: 22 }}>
              {aiText}
            </Text>
          )}
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.bottomEmoji}>😴</Text>
          <Text style={styles.bottomText}>좋은 밤 되세요!</Text>
        </View>

      </ScrollView>
    </View>
  );
}
