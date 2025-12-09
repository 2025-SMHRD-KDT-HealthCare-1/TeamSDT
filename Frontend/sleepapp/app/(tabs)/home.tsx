import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import api from "../api/apiconfig";
import { Moon, Clock, Smartphone, Coffee } from "lucide-react-native";
import styles from "../../styles/homestyles";
import StarsBackground from "../../components/starsbackground";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

export default function HomeScreen() {
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAudioBase64, setAiAudioBase64] = useState<string | null>(null);

  async function playBase64Audio(base64Audio?: string) {
    try {
      if (!base64Audio) return;

      const fileUri = FileSystem.documentDirectory + "ai_tts.mp3";

      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Audio.Sound.createAsync({ uri: fileUri }, { shouldPlay: true });
    } catch (err) {
      console.log("TTS 재생 오류:", err);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const me = await api.get("/user/me");
        if (!mounted) return;

        setNick(me.data.nick);

        const dash = await api.get(`/home/dashboard/${me.data.user_id}`);
        if (!mounted) return;

        setDashboard(dash.data);

        setLoading(false);

        // AI 호출
        setAiLoading(true);

        const totalSleepHour =
          (dash.data?.totalSleep.hours ?? 0) +
          (dash.data?.totalSleep.minutes ?? 0) / 60;

        const aiRes = await fetch(
          "https://christal-nonsignificative-noneternally.ngrok-free.dev/ai",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_name: me.data.nick,
              caffeine: dash.data?.caffeine.mg ?? 0,
              screen_time:
                (dash.data?.screenTime.hours ?? 0) +
                (dash.data?.screenTime.minutes ?? 0) / 60,
              sleep_time: totalSleepHour,
              style: "친근하게",
            }),
          }
        );

        const data = await aiRes.json();
        if (!mounted) return;

        setAiText(data.text || "");

        if (data.audio_base64) {
          setAiAudioBase64(data.audio_base64);
          playBase64Audio(data.audio_base64);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (mounted) {
          setLoading(false);
          setAiLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#7aa2ff" size="large" />
        <Text style={styles.loadingText}>데이터 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0D1A" }}>
      <StarsBackground style={styles.starsContainer} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={[styles.header, { backgroundColor: "rgba(62,79,147,0.85)" }]}>
          <View>
            <Text style={styles.headerWelcome}>환영합니다</Text>
            <Text style={styles.headerName}>{nick}님 🌙</Text>
          </View>
          <View style={styles.headerIconBox}>
            <Moon size={40} color="white" />
          </View>
        </View>

        {/* 수면 리포트 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 요약</Text>

          {/* 총 수면시간 */}
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Clock size={26} color="#7aa2ff" />
              <Text style={styles.label}>총 수면시간</Text>
            </View>
            <Text style={styles.value}>
              {dashboard
                ? `${dashboard.totalSleep.hours}시간 ${dashboard.totalSleep.minutes}분`
                : "기록 없음"}
            </Text>
          </View>

          {/* 스마트폰 사용 */}
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Smartphone size={24} color="#7aa2ff" />
              <Text style={styles.label}>스마트폰 사용</Text>
            </View>
            <Text style={styles.value}>
              {dashboard
                ? `${dashboard.screenTime.hours}시간 ${dashboard.screenTime.minutes}분`
                : "기록 없음"}
            </Text>
          </View>

          {/* 카페인 섭취 */}
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Coffee size={24} color="#7aa2ff" />
              <Text style={styles.label}>카페인 섭취</Text>
            </View>
            <Text style={styles.value}>
              {dashboard
                ? `${dashboard.caffeine.cups}잔 / ${dashboard.caffeine.mg}mg`
                : "기록 없음"}
            </Text>
          </View>
        </View>

        {/* AI 분석 */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.cardTitle}>AI 수면 분석</Text>

          {aiLoading ? (
            <Text style={{ color: "#888", marginTop: 10 }}>AI 분석 중...</Text>
          ) : (
            <>
              <Text style={{ color: "white", marginTop: 10, lineHeight: 22 }}>
                {aiText || "아직 분석 데이터가 없습니다."}
              </Text>

              {aiAudioBase64 && (
                <Text
                  onPress={() => playBase64Audio(aiAudioBase64)}
                  style={{
                    marginTop: 12,
                    color: "#7aa2ff",
                    fontWeight: "bold",
                  }}
                >
                  🔊 음성으로 다시 듣기
                </Text>
              )}
            </>
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
