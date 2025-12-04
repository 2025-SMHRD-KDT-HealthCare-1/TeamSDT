import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import styles from "../../styles/measurestyles";
import StarsBackground from "../../components/starsbackground";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Measure() {
  const [bedTime, setBedTime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());

  const [showBedPicker, setShowBedPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);

  const [screenOff, setScreenOff] = useState(true);
  const [micMode, setMicMode] = useState(true);

  const [alarm, setAlarm] = useState(true);
  const [micPermission, setMicPermission] = useState(true);
  const [usagePermission, setUsagePermission] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <StarsBackground />

      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>취침시간</Text>
        <TouchableOpacity onPress={() => setShowBedPicker(true)} style={styles.timeBtn}>
          <Text style={styles.timeText}>
            {bedTime.getHours()} : {bedTime.getMinutes().toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>

        {showBedPicker && (
          <DateTimePicker
            value={bedTime}
            mode="time"
            onChange={(e, d) => {
              setShowBedPicker(false);
              d && setBedTime(d);
            }}
          />
        )}

        <Text style={styles.sectionTitle}>기상시간</Text>
        <TouchableOpacity onPress={() => setShowWakePicker(true)} style={styles.timeBtn}>
          <Text style={styles.timeText}>
            {wakeTime.getHours()} : {wakeTime.getMinutes().toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>

        {showWakePicker && (
          <DateTimePicker
            value={wakeTime}
            mode="time"
            onChange={(e, d) => {
              setShowWakePicker(false);
              d && setWakeTime(d);
            }}
          />
        )}

        {/* 수면 측정 방식 */}
        <Text style={styles.sectionTitle}>수면 측정 방식</Text>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>스크린 타임 OFF 감지</Text>
          <Switch value={screenOff} onValueChange={setScreenOff} />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>마이크 (코골이 / 호흡 패턴)</Text>
          <Switch value={micMode} onValueChange={setMicMode} />
        </View>

        {/* 권한 */}
        <Text style={styles.sectionTitle}>권한</Text>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>알림 / 알람</Text>
          <Switch value={alarm} onValueChange={setAlarm} />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>마이크</Text>
          <Switch value={micPermission} onValueChange={setMicPermission} />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>사용정보 접근</Text>
          <Switch value={usagePermission} onValueChange={setUsagePermission} />
        </View>

        {/* 버튼 */}
        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startBtnText}>수면 측정 시작하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
