import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Moon, AlarmClock } from "lucide-react-native";
import styles from "../../styles/measurestyles";

interface SleepSettingsPageProps {
  onSave: () => void;
}

export default function SleepSettingsPage({ onSave }: SleepSettingsPageProps) {
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");

  const handleSave = () => {
    onSave();
    alert("수면 측정을 시작합니다!");
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

      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>수면 측정 설정</Text>
      </View>

      {/* 내용 영역 */}
      <View style={styles.innerContainer}>

        {/* 캐릭터 */}
        <View style={styles.characterWrap}>
          <Text style={styles.characterEmoji}>🦥</Text>
          <Text style={styles.characterText}>수면 시간을 설정해주세요</Text>
        </View>

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

          <Text style={styles.bottomText}>매일 같은 시간에 잠드는 것이 중요해요</Text>
        </View>

        {/* 예상 수면 시간 */}
        <View style={styles.sleepPreview}>
          <View style={styles.line} />
          <View style={styles.sleepCenter}>
            <Text style={styles.subLabel}>예상 수면 시간</Text>
            <Text style={styles.sleepHour}>8시간</Text>
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

          <Text style={styles.bottomText}>일정한 기상 시간이 수면 리듬을 만들어요</Text>
        </View>

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>수면 측정 시작</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
