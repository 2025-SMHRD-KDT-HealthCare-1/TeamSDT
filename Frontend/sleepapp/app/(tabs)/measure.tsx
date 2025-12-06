import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Moon, AlarmClock } from "lucide-react-native";
import { router } from "expo-router";
import styles from "../../styles/measurestyles";

export default function SleepSettingsPage() {
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");

  // 👉 수면 시간 계산
  const calcSleepHours = () => {
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);

    let bedTotal = bh * 60 + bm;
    let wakeTotal = wh * 60 + wm;

    if (wakeTotal < bedTotal) {
      wakeTotal += 24 * 60; // 다음날로 넘어감
    }

    const diff = wakeTotal - bedTotal;
    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h}시간 ${m}분`;
  };

  // 👉 "수면 측정 시작" 눌렀을 때 타이머 페이지로 이동
  const handleSave = () => {
    router.push({
      pathname: "../measure/sleeptimer",
      params: { bedtime, wakeTime },
    });
  };

  return (
    <ScrollView style={styles.container}>

      {/* ⭐ 별 배경 */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 80 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
          return (
            <View
              key={i}
              style={[
                styles.star,
                {
                  width: size,
                  height: size,
                  transform: [
                    { translateX: Math.random() * 400 },
                    { translateY: Math.random() * 800 },
                  ],
                },
              ]}
            />
          );
        })}
      </View>

      {/* 제목 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>수면 측정 설정</Text>
      </View>

      <View style={styles.innerContainer}>

        {/* 취침시간 */}
        <View style={styles.card}>
          <Text style={styles.label}>취침시간</Text>
          <Text style={styles.subLabel}>Bedtime</Text>

          <View style={styles.timeBox}>
            <Moon size={56} color="#5b6fb9" style={styles.icon} />
            <TextInput
              value={bedtime}
              onChangeText={setBedtime}
              keyboardType="numeric"
              style={styles.timeInput}
            />
          </View>

          <Text style={styles.bottomText}>규칙적인 취침이 건강에 좋아요</Text>
        </View>

        {/* 예상 수면 시간 */}
        <View style={styles.sleepPreview}>
          <View style={styles.line} />
          <View style={styles.sleepCenter}>
            <Text style={styles.subLabel}>예상 수면 시간</Text>
            <Text style={styles.sleepHour}>{calcSleepHours()}</Text>
          </View>
          <View style={styles.line} />
        </View>

        {/* 기상시간 */}
        <View style={styles.card}>
          <Text style={styles.label}>기상시간</Text>
          <Text style={styles.subLabel}>Wake-up Time</Text>

          <View style={styles.timeBox}>
            <AlarmClock size={56} color="#5b6fb9" style={styles.iconDelay} />
            <TextInput
              value={wakeTime}
              onChangeText={setWakeTime}
              keyboardType="numeric"
              style={styles.timeInput}
            />
          </View>

          <Text style={styles.bottomText}>일정한 기상은 생체리듬을 만듭니다</Text>
        </View>

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>수면 측정 시작</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
