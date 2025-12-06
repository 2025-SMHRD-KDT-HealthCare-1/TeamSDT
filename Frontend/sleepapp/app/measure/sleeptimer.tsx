import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import styles from "../../styles/sleeptimerstyle";

export default function SleepTimer() {
  const params = useLocalSearchParams();

  // ⭐ string 또는 string[] → string 강제 캐스팅
  const bedtime = Array.isArray(params.bedtime)
    ? params.bedtime[0]
    : params.bedtime || "23:00";

  const wakeTime = Array.isArray(params.wakeTime)
    ? params.wakeTime[0]
    : params.wakeTime || "07:00";

  // ⭐ 수면 시간 계산
  const calcRemainingTime = () => {
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);

    let bedTotal = bh * 60 + bm;
    let wakeTotal = wh * 60 + wm;

    if (wakeTotal < bedTotal) wakeTotal += 24 * 60; // 다음날

    const diff = wakeTotal - bedTotal;
    return diff * 60 * 1000;
  };

  const total = calcRemainingTime();
  const startTime = Date.now();

  const [remaining, setRemaining] = useState(total);

  // ⭐ 타이머 실행
  useEffect(() => {
    const interval = setInterval(() => {
      const passed = Date.now() - startTime;
      const left = total - passed;
      setRemaining(left > 0 ? left : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ⭐ 시간 포맷
  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${h}시간 ${m}분 ${s}초`;
  };

  // 종료 버튼
  const handleEnd = () => {
    alert("수면 측정을 종료합니다!");
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌙 수면 측정 중...</Text>

      <Text style={styles.timer}>{formatTime(remaining)}</Text>

      <Text style={styles.desc}>편안한 잠을 취하는 중입니다 😴</Text>

      <TouchableOpacity style={styles.endBtn} onPress={handleEnd}>
        <Text style={styles.endBtnText}>측정 종료</Text>
      </TouchableOpacity>
    </View>
  );
}
