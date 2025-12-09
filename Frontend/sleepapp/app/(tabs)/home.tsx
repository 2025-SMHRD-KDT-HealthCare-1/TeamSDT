import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Moon, Clock, Smartphone, Coffee } from "lucide-react-native";
import styles from "../../styles/homestyles";
import StarsBackground from "../../components/starsbackground";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

export default function HomeScreen() {
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ 어제 수면 + 홈 대시보드 데이터
  const [dashboard, setDashboard] = useState<{
    totalSleep: { hours: number; minutes: number };
    sleepTime: { hours: number; minutes: number };
    wakeTime: { hours: number; minutes: number };
    screenTime: { hours: number; minutes: number };
    caffeine: { type: string; cups: number; mg: number };
  } | null>(null);

  // ✅ AI
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAudioBase64, setAiAudioBase64] = useState<string | null>(null);

  // ✅ TTS 재생
  async function playBase64Audio(base64Audio?: string) {
    try {
      if (!base64Audio) {
        console.log("⚠️ TTS 음성 데이터가 없습니다.");
        return;
      }

      const fileUri =
        (FileSystem as any).documentDirectory + "ai_tts.mp3";

      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: "base64",
      });

      await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );
    } catch (err) {
      console.log("TTS 재생 오류:", err);
    }
  }

  // -----------------------------------------
  // 🚀 여기부터 네트워크 제거 → 가짜 데이터 적용
  // -----------------------------------------
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        // 📌 1) 가상 유저 정보
        const fakeUser = {
          nick: "테스트유저",
          user_id: "user123",
        };
        setNick(fakeUser.nick);

        // 📌 2) 가상 대시보드 데이터 (더미)
        const fakeDashboard = {
          totalSleep: { hours: 7, minutes: 40 },
          sleepTime: { hours: 23, minutes: 10 },
          wakeTime: { hours: 6, minutes: 50 },
          screenTime: { hours: 2, minutes: 15 },
          caffeine: { type: "아메리카노", cups: 2, mg: 180 },
        };
        setDashboard(fakeDashboard);

        // 📌 3) 가상 AI 분석 결과 텍스트
        setAiLoading(true);
        const fakeAiText =
          "어제 수면 시간이 충분했어요! 👍\n카페인 섭취는 적당한 수준이며, 스마트폰 사용 시간도 괜찮은 편이에요.\n오늘도 좋은 컨디션으로 하루를 보내세요! 😄";
        setAiText(fakeAiText);

        // 📌 4) 가상 오디오(base64)
        // 실제 base64는 매우 길어서 테스트용 짧은 빈 오디오(base64) 값 사용
        const fakeAudio = null; // 🔥 필요하면 base64 테스트용 파일 가능
        setAiAudioBase64(fakeAudio);

      } catch (err) {
        console.log("가상 데이터 로드 오류:", err);
      } finally {
        setLoading(false);
        setAiLoading(false);
      }
    }

    init();
  }, []);

  // -----------------------------------------

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
        {/* ✅ 헤더 */}
        <View
          style={[styles.header, { backgroundColor: "rgba(62,79,147,0.85)" }]}
        >
          <View>
            <Text style={styles.headerWelcome}>환영합니다</Text>
            <Text style={styles.headerName}>{nick}님 🌙</Text>
          </View>

          <View style={styles.headerIconBox}>
            <Moon size={40} color="white" />
          </View>
        </View>

        {/* ✅ 어제 수면 리포트 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 수면 리포트</Text>

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

          <View style={styles.rowBetween}>
            <Text style={styles.smallLabel}>잠든 시간</Text>
            <Text style={styles.smallValue}>
              {dashboard
                ? `${dashboard.sleepTime.hours}시 ${dashboard.sleepTime.minutes}분`
                : "기록 없음"}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.smallLabel}>기상 시간</Text>
            <Text style={styles.smallValue}>
              {dashboard
                ? `${dashboard.wakeTime.hours}시 ${dashboard.wakeTime.minutes}분`
                : "기록 없음"}
            </Text>
          </View>

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

          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Coffee size={24} color="#7aa2ff" />
              <Text style={styles.label}>카페인 섭취</Text>
            </View>
            <Text style={styles.value}>
              {dashboard
                ? `${dashboard.caffeine.type} / ${dashboard.caffeine.cups}잔 / ${dashboard.caffeine.mg}mg`
                : "기록 없음"}
            </Text>
          </View>
        </View>

        {/* ✅ AI 분석 + 다시 듣기 버튼 */}
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
