import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/mypagestyles";
import {
  ChevronRight,
  Volume2,
  Mic,
  Bell,
  LogOut,
  UserX,
} from "lucide-react-native";

export default function MyPage() {
  const [userInfo, setUserInfo] = useState({
    nick: "사용자",
    email: "",
    phone: "",
  });

  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [sleepDetectionEnabled, setSleepDetectionEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserInfo(parsed);
        }
      } catch (e) {
        console.log("유저 정보 로드 실패:", e);
      }
    };

    loadUserData();
  }, []);

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      Alert.alert("로그아웃 완료", "다시 로그인 해주세요.");
    } catch (e) {
      Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
    }
  };

  const firstLetter = userInfo.nick.charAt(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <View style={styles.content}>
        {/* 프로필 카드 */}
        <View style={styles.card}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{userInfo.nick}님</Text>

              <TouchableOpacity
                style={styles.profileEditBtn}
                onPress={() => console.log("프로필 편집 클릭")}
              >
                <Text style={styles.profileEditText}>프로필 편집</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>이메일</Text>
            <Text style={styles.infoValue}>{userInfo.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>전화번호</Text>
            <Text style={styles.infoValue}>{userInfo.phone}</Text>
          </View>
        </View>

        {/* 설정 */}
        <Text style={styles.sectionTitle}>설정</Text>
        <View style={styles.card}>
          <SwitchSetting
            icon={<Volume2 color="#2d3e82" />}
            title="알람 설정"
            value={alarmEnabled}
            onValueChange={setAlarmEnabled}
          />
          <SwitchSetting
            icon={<Mic color="#2d3e82" />}
            title="수면 감지 권한 관리"
            value={sleepDetectionEnabled}
            onValueChange={setSleepDetectionEnabled}
          />
          <SwitchSetting
            icon={<Bell color="#2d3e82" />}
            title="앱 알림 설정"
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            noBorder
          />
        </View>

        {/* 보안 */}
        <Text style={styles.sectionTitle}>보안/계정</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingBtn} onPress={logoutHandler}>
            <View style={styles.settingLeft}>
              <LogOut color="#2d3e82" />
              <Text style={styles.settingText}>로그아웃</Text>
            </View>
            <ChevronRight color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingBtn, { backgroundColor: "#fef2f2" }]}
            onPress={() =>
              Alert.alert("회원탈퇴", "정말로 탈퇴하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "탈퇴하기", style: "destructive", onPress: logoutHandler },
              ])
            }
          >
            <View style={styles.settingLeft}>
              <UserX color="#ef4444" />
              <Text style={[styles.settingText, { color: "#ef4444" }]}>
                회원탈퇴
              </Text>
            </View>
            <ChevronRight color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.characterBox}>
          <Text style={styles.characterEmoji}>👤</Text>
          <Text style={styles.characterText}>설정을 관리하세요</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// 🔁 스위치 설정 컴포넌트
function SwitchSetting({ icon, title, value, onValueChange, noBorder = false }) {
  return (
    <View style={[styles.settingBtn, !noBorder && styles.settingBorder]}>
      <View style={styles.settingLeft}>
        {icon}
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
