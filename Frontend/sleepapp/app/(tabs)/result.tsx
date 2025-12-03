import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "../../styles/resultstyles";




export default function SleepResult() {
  const [tab, setTab] = useState<"day" | "week" | "month" | "all">("week");

  return (
    <ScrollView style={styles.container}>
      {/* 상단 탭 */}
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
            onPress={() => setTab(item.key as any)}
          >
            <Text style={[styles.tabText, tab === item.key && styles.tabSelectedText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 그래프 영역 */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>수면 시간 그래프 (요일별)</Text>
        <View style={styles.graphBox}>
          <Text style={styles.graphPlaceholder}>그래프 들어가는 곳</Text>
        </View>
      </View>

      {/* AI 흐름 분석 */}
      <View style={styles.aiBox}>
        <View style={styles.aiTitleRow}>
          <Text style={styles.aiIcon}>📈</Text>
          <Text style={styles.aiTitle}>AI 흐름 분석</Text>
        </View>

        <Text style={styles.aiText}>
          이번 주 평균 수면은 7시간 30분입니다. 주말(토, 일)에 수면 시간이 크게 증가하여 전체
          평균을 끌어올렸습니다. 평일에는 취침 시간이 평균 30분 지연되어 수면 효율이 15%
          감소했습니다. 다음 주에는 평일 취침시간을 11시 전으로 고정하는 것을 권장합니다.
        </Text>
      </View>

      {/* 이모지 & 문구 */}
      <View style={styles.footerSection}>
        <Text style={styles.emoji}>😎🛏️</Text>
        <Text style={styles.footerText}>계속 좋은 수면 습관을 유지하세요!</Text>
      </View>
    </ScrollView>
  );
}
