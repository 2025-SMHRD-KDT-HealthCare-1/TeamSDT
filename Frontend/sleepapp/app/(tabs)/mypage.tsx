import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import styles from "../../styles/mypagestyles";
import {
  ChevronRight,
  Volume2,
  Mic,
  Bell,
  Database,
  Coffee,
  Smartphone,
  LogOut,
  UserX,
} from "lucide-react-native";

interface MyPageProps {
  userName?: string;
  onLogout?: () => void;
}

export default function MyPage({ userName, onLogout }: MyPageProps) {
  const safeName = userName ?? "사용자";
  const firstLetter = safeName.charAt(0);

  const userInfo = {
    name: safeName,
    email: "user@example.com",
    phone: "010-1234-5678",
  };

  const logoutHandler = () => {
    if (onLogout) onLogout();
    else Alert.alert("로그아웃", "onLogout 함수가 없습니다.");
  };

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
              <Text style={styles.profileName}>{safeName}님</Text>

              <TouchableOpacity
                style={styles.profileEditBtn}
                onPress={() => router.push("../components/profile-edit")}
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
          <SettingButton
            icon={<Volume2 color="#2d3e82" />}
            title="알람 설정"
            onPress={() => router.push("../components/alarm")}
          />
          <SettingButton
            icon={<Mic color="#2d3e82" />}
            title="수면 감지 권한 관리"
            onPress={() => router.push("../components/sleep-permission")}
          />
          <SettingButton
            icon={<Bell color="#2d3e82" />}
            title="앱 알림 설정"
            onPress={() => router.push("../components/notification")}
          />
          <SettingButton
            icon={<Database color="#2d3e82" />}
            title="데이터 관리"
            noBorder
            onPress={() => router.push("../components/data")}
          />
        </View>

        {/* 내 정보 */}
        <Text style={styles.sectionTitle}>내 정보</Text>
        <View style={styles.card}>
          <SettingButton
            icon={<Coffee color="#2d3e82" />}
            title="카페인 기록 전체 보기"
            onPress={() => router.push("../components/caffeine")}
          />
          <SettingButton
            icon={<Smartphone color="#2d3e82" />}
            title="스크린 타임 기록 전체 보기"
            noBorder
            onPress={() => router.push("../components/screentime")}
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
              Alert.alert(
                "회원탈퇴",
                "정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.",
                [
                  { text: "취소", style: "cancel" },
                  {
                    text: "탈퇴하기",
                    style: "destructive",
                    onPress: logoutHandler,
                  },
                ]
              )
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

function SettingButton({ icon, title, noBorder = false, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.settingBtn, !noBorder && styles.settingBorder]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        {icon}
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <ChevronRight color="#6b7280" />
    </TouchableOpacity>
  );
}
