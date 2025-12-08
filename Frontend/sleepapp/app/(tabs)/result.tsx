import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../styles/resultstyles";
import api from "../api/apiconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StarsBackground from "../../components/starsbackground";

type TabType = "day" | "week" | "month" | "all";

export default function SleepResult() {
  const [tab, setTab] = useState<TabType>("week");
  const [graphData, setGraphData] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const tokenUser = await AsyncStorage.getItem("user_id");
    setUserId(tokenUser);
  };

  useEffect(() => {
    if (userId) fetchResult();
  }, [tab, userId]);

  // ✅ ✅ ✅ 여기만 실데이터 연동으로 교체됨
  const fetchResult = async () => {
    try {
      setError(null);

      // ✅ 실제 수면 기록 기반 API
      const res = await api.get(
        `/sleep/history/${userId}?period=${tab}`
      );

      // ✅ 그래프 데이터만 연결
      setGraphData(
        Array.isArray(res.data.graph) ? res.data.graph : []
      );

      // ✅ AI는 아직 유지 (없으면 null)
      setAiData(res.data.ai ?? null);

    } catch (err) {
      setError("서버 연결 실패");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0D1A" }}>
      
      <StarsBackground style={styles.starsContainer} />

      <ScrollView style={styles.container}>
        
        <View style={styles.tabContainer}>
          {["day", "week", "month", "all"].map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setTab(key as TabType)}
              style={[
                styles.tabBtn,
                tab === key && styles.tabSelected
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === key && styles.tabSelectedText
                ]}
              >
                {{
                  day: "일",
                  week: "주",
                  month: "월",
                  all: "전체",
                }[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>수면 시간</Text>

          {error ? (
            <Text style={styles.graphPlaceholder}>{error}</Text>
          ) : graphData.length === 0 ? (
            <Text style={styles.graphPlaceholder}>데이터 없음</Text>
          ) : (
            <View style={styles.barChartWrapper}>
              {graphData.map((item, idx) => {
                const sleep = Number(item.sleep) || 0;
                const maxHour = 10;

                const ratio = Math.min(Math.max(sleep / maxHour, 0), 1);
                const barHeight = ratio * 140;
                const barColor = `rgba(110,168,254,${0.3 + ratio * 0.7})`;

                return (
                  <View key={`${item.label}-${idx}`} style={styles.barItem}>
                    <View style={[styles.bar, { height: barHeight, backgroundColor: barColor }]} />
                    <Text style={[styles.barLabel, { color: barColor }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.barValue, { color: barColor }]}>
                      {sleep}h
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.aiBox}>
          <Text style={styles.aiTitle}>AI 수면 흐름 분석</Text>

          <Text style={styles.aiText}>
            {aiData ? (
              <>
                {aiData.summary}{"\n"}
                {aiData.problem}{"\n"}
                {aiData.effect}{"\n"}
                {aiData.solution}
              </>
            ) : (
              "분석 데이터 없음"
            )}
          </Text>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.emoji}>😎🛏️</Text>
          <Text style={styles.footerText}>좋은 수면 습관을 유지하세요!</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
