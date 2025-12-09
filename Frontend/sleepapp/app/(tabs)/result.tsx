import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../styles/resultstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StarsBackground from "../../components/starsbackground";

type TabType = "day" | "week" | "month" | "all";

export default function SleepResult() {
  const [tab, setTab] = useState<TabType>("week");
  const [graphData, setGraphData] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any>(null);

  // -----------------------------------
  // 🚀 가상 그래프 데이터 정의
  // -----------------------------------
  const fakeGraph = {
    day: [
      { label: "오늘", sleep: 6.5 },
    ],
    week: [
      { label: "월", sleep: 6.2 },
      { label: "화", sleep: 7.4 },
      { label: "수", sleep: 5.8 },
      { label: "목", sleep: 6.9 },
      { label: "금", sleep: 7.1 },
      { label: "토", sleep: 8.0 },
      { label: "일", sleep: 7.5 },
    ],
    month: Array.from({ length: 30 }).map((_, i) => ({
      label: `${i + 1}`,
      sleep: Math.round((5 + Math.random() * 4) * 10) / 10, // 5~9시간 랜덤
    })),
    all: [
      { label: "1월", sleep: 6.8 },
      { label: "2월", sleep: 7.1 },
      { label: "3월", sleep: 6.4 },
      { label: "4월", sleep: 7.3 },
      { label: "5월", sleep: 6.9 },
      { label: "6월", sleep: 7.6 },
    ],
  };

  // -----------------------------------
  // 🚀 가상 AI 분석 데이터
  // -----------------------------------
  const fakeAi = {
    summary: "최근 수면 패턴은 전반적으로 안정적입니다.",
    problem: "평일에는 수면 시간이 다소 부족한 경향이 있습니다.",
    effect: "수면 부족은 피로 누적과 집중력 저하로 이어질 수 있습니다.",
    solution: "평일 취침 시간을 30분만 앞당기면 전체 흐름이 크게 개선됩니다.",
  };

  // -----------------------------------
  // 🚀 탭 변경 시 가상 데이터 세팅
  // -----------------------------------
  useEffect(() => {
    setGraphData(fakeGraph[tab]);
    setAiData(fakeAi);
  }, [tab]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0D1A" }}>
      
      <StarsBackground style={styles.starsContainer} />

      <ScrollView style={styles.container}>
        
        {/* 탭 버튼 */}
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

        {/* 그래프 영역 */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>수면 시간</Text>

          {graphData.length === 0 ? (
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
                    <View
                      style={[
                        styles.bar,
                        { height: barHeight, backgroundColor: barColor },
                      ]}
                    />
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

        {/* AI 분석 */}
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
