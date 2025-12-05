import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import styles from "../../styles/step2styles";

import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import * as IntentLauncher from "expo-intent-launcher";
import { NativeModules } from "react-native";

const { ScreenTime } = NativeModules;

export default function Step2() {
  const [mic, setMic] = useState(false);        // 필수
  const [screen, setScreen] = useState(false);  // 필수
  const [noti, setNoti] = useState(false);      // 선택

  // ⭐ 필수 권한 체크 여부
  const canStart = mic && screen;

  // ---------------------------------------
  // ⭐ 핵심: UsageStats를 한 번 호출해 OS에 앱 등록시키기
  // ---------------------------------------
  const warmupUsageAccess = () => {
    try {
      if (Platform.OS === "android" && ScreenTime?.getTodayScreenTime) {
        ScreenTime.getTodayScreenTime().catch(() => {});
      }
    } catch {}
  };

  // ---------------------------------------
  // 1) 마이크 권한
  // ---------------------------------------
  const requestMicPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  };

  // ---------------------------------------
  // 2) 알림 권한
  // ---------------------------------------
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  };

  // ---------------------------------------
  // 3) 스크린타임 권한 (설정창 이동)
  // ---------------------------------------
  const requestScreenTimePermission = async () => {
    try {
      if (Platform.OS === "android") {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.USAGE_ACCESS_SETTINGS
        );
      }
      return true;
    } catch {
      return false;
    }
  };

  // ---------------------------------------
  // ⭐ "시작하기" 눌렀을 때
  // ---------------------------------------
  const handleStart = async () => {
    if (mic) await requestMicPermission();
    if (noti) await requestNotificationPermission();
    if (screen) await requestScreenTimePermission();

    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>필수 권한 설정</Text>
      <Text style={styles.desc}>앱 기능을 이용하기 위해 필요한 권한입니다.</Text>

      <View style={styles.box}>

        {/* 🎤 마이크 */}
        <View style={styles.row}>
          <Checkbox value={mic} onValueChange={() => setMic(!mic)} />
          <Text style={styles.label}>🎤 마이크 권한 (필수)</Text>
        </View>

        {/* 📱 스크린타임 */}
        <View style={styles.row}>
          <Checkbox
            value={screen}
            onValueChange={() => {
              setScreen(!screen);
              warmupUsageAccess();   // ⭐ OS에 앱 등록시키는 핵심 포인트
            }}
          />
          <Text style={styles.label}>📱 사용정보 접근 (필수)</Text>
        </View>

        {/* 🔔 알림 */}
        <View style={styles.row}>
          <Checkbox value={noti} onValueChange={() => setNoti(!noti)} />
          <Text style={styles.label}>🔔 알림 권한 (선택)</Text>
        </View>

      </View>

      {/* 🚀 시작하기 */}
      <TouchableOpacity
        style={[styles.startBtn, !canStart && { opacity: 0.3 }]}
        disabled={!canStart}
        onPress={handleStart}
      >
        <Text style={styles.startText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}
