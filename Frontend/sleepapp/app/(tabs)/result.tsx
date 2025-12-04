import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ 정석 SafeArea
import styles from "../../styles/resultstyles";
import api from "../api/apiconfig";

type TabType = "day" | "week" | "month" | "all";

export default function SleepResult() {
  const [tab, setTab] = useState<TabType>("week");
  const [graphData, setGraphData] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResult();
  }, [tab]);

  const fetchResult = async () => {
    try {
      setError(null);
      const res = await api.get(`/result/sleep?period=${tab}`);
      setGraphData(res.data.graph);
      setAiData(res.data.ai);
    } catch (err) {
      setError("서버 연결 실패");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0E1529" }}>
      <ScrollView style={styles.container}>
        {/* ✅ 상단 탭 */}
        <View style={styles.tabContainer}>
          {[
            { key: "day", label: "일" },
            { key: "week", label: "주" },
            { key: "month", label: "월" },
            { key: "all", label: "전체" },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.tabBtn, tab === item.key && styles.tabSelected]}
              onPress={() => setTab(item.key as TabType)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === item.key && styles.tabSelectedText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ✅ 그래프 */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>수면 시간</Text>

          {error ? (
            <Text style={styles.graphPlaceholder}>{error}</Text>
          ) : graphData.length === 0 ? (
            <Text style={styles.graphPlaceholder}>데이터 없음</Text>
          ) : (
            <View style={styles.barChartWrapper}>
              {graphData.map((item, idx) => {
                const maxHour = 10;
                const ratio = item.sleep / maxHour;
                const barHeight = Math.min(ratio * 140, 140);

                // ✅ 수면시간 높을수록 더 진해지는 색
                const barColor = `rgba(110,168,254,${0.3 + ratio * 0.7})`;

                return (
                  <View key={idx} style={styles.barItem}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.barLabel,
                        { color: barColor },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.barValue,
                        { color: barColor },
                      ]}
                    >
                      {item.sleep}h
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ✅ AI 분석 영역 */}
        <View style={styles.aiBox}>
          <View style={styles.aiTitleRow}>
            <Text style={styles.aiIcon}>📈</Text>
            <Text style={styles.aiTitle}>AI 수면 흐름 분석</Text>
          </View>

          {aiData ? (
            <Text style={styles.aiText}>
              {aiData.summary}{"\n"}
              {aiData.problem}{"\n"}
              {aiData.effect}{"\n"}
              {aiData.solution}
            </Text>
          ) : (
            <Text style={styles.aiText}>분석 데이터 없음</Text>
          )}
        </View>

        {/* ✅ 하단 */}
        <View style={styles.footerSection}>
          <Text style={styles.emoji}>😎🛏️</Text>
          <Text style={styles.footerText}>
            계속 좋은 수면 습관을 유지하세요!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
