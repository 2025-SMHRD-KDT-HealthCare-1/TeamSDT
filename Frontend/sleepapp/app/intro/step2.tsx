import { View, Text, TouchableOpacity } from "react-native";
import StarsBackground from "../../components/starsbackground";
import { router } from "expo-router";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import styles from "../../styles/step2styles";

import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";

type PermissionKey = "mic" | "noti" | "screen";

export default function Step2() {
  const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>({
    mic: false,
    noti: false,
    screen: false,
  });

  const toggle = (key: PermissionKey) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const requestMicPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    return status === "granted";
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };

  const requestScreenTimePermission = async () => {
    if (Platform.OS !== "android") return true;

    IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.USAGE_ACCESS_SETTINGS
    );
    return true;
  };

  const handleStart = async () => {
    if (permissions.mic) await requestMicPermission();
    if (permissions.noti) await requestNotificationPermission();
    if (permissions.screen) await requestScreenTimePermission();

    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <StarsBackground />

      <Text style={styles.title}>앱 사용을 위한 권한 설정</Text>
      <Text style={styles.desc}>사용하고 싶은 기능을 선택해주세요</Text>

      <View style={styles.box}>
        <View style={styles.row}>
          <Checkbox value={permissions.mic} onValueChange={() => toggle("mic")} />
          <Text style={styles.label}>🎤 마이크 권한 (코골이/소리 감지)</Text>
        </View>

        <View style={styles.row}>
          <Checkbox value={permissions.noti} onValueChange={() => toggle("noti")} />
          <Text style={styles.label}>🔔 알림 권한 (AI 수면 리포트)</Text>
        </View>

        <View style={styles.row}>
          <Checkbox
            value={permissions.screen}
            onValueChange={() => toggle("screen")}
          />
          <Text style={styles.label}>📱 사용정보 접근 (스크린타임 분석)</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
        <Text style={styles.startText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}
