import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from "react-native";

import {
  Bell,
  LogOut,
  UserX,
  Calendar as CalendarIcon,
} from "lucide-react-native";

import { Calendar } from "react-native-calendars";
import styles from "../../styles/mypagestyles";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { logout } from "../logout";

interface MyPageProps {
  userName: string;
}

export default function MyPage({ userName }: MyPageProps) {
  const TODAY = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [dailyData, setDailyData] = useState<any>({
    sleep: "기록 없음",
    screentime: "기록 없음",
    caffeine: "기록 없음"
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [nick, setNick] = useState<string>(userName);
  const [user, setUser] = useState<any>(null);
  const [allowNoti, setAllowNoti] = useState(false);

  // -------------------------------------------------------------
  // 🚀 날짜별 랜덤 더미 데이터 생성
  // -------------------------------------------------------------
  function generateDummyData() {
    const data: Record<string, any> = {};

    for (let d = 1; d <= 30; d++) {
      const date = `2025-02-${String(d).padStart(2, "0")}`;

      data[date] = {
        sleep: `${(5 + Math.random() * 4).toFixed(1)}시간`,
        screentime: `${(1 + Math.random() * 4).toFixed(1)}시간`,
        caffeine:
          Math.random() < 0.4
            ? "없음"
            : `${Math.floor(Math.random() * 250)}mg`,
      };
    }

    return data;
  }

  const dummyData = generateDummyData();

  // ⭐ 앱 실행 시 기본 설정
  useEffect(() => {
    setNick("테스트유저");
    setUser({ nick: "테스트유저" });

    applyDailyData(TODAY);
  }, []);

  // -------------------------------------------------------------
  // ⭐ 날짜 선택 시 더미데이터 적용하는 함수
  // -------------------------------------------------------------
  const applyDailyData = (date: string) => {
    const baseData = dummyData[date] || {
      sleep: "기록 없음",
      screentime: "기록 없음",
      caffeine: "기록 없음",
    };

    setDailyData(baseData); // 먼저 더미데이터 적용

    // 이후 저장된 카페인 기록 있으면 수정
    loadDailyCaffeine(date, baseData);
  };

  // -------------------------------------------------------------
  // ⭐ AsyncStorage 카페인 기록 반영
  // -------------------------------------------------------------
  const loadDailyCaffeine = async (date: string, base: any) => {
    try {
      const saved = await AsyncStorage.getItem("daily_caffeine_records");
      if (!saved) return;

      const data = JSON.parse(saved);
      const records = data[date];

      if (!records || records.length === 0) return;

      const caffeineTotal = records.reduce(
        (sum: number, r: any) => sum + r.caffeine,
        0
      );

      setDailyData({
        ...base,
        caffeine: `${caffeineTotal}mg`,
      });
    } catch (err) {
      console.log("카페인 불러오기 오류:", err);
    }
  };

  // ⭐ 날짜 선택 시 실행
  useEffect(() => {
    applyDailyData(selectedDate);
  }, [selectedDate]);

  // ⭐ 알림 설정
  const handleNotificationToggle = async () => {
    if (allowNoti) {
      setAllowNoti(false);
      return;
    }

    Alert.alert(
      "알림 권한",
      "수면 리포트 및 앱 알림을 위해 권한을 허용하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "허용",
          onPress: async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === "granted") {
              setAllowNoti(true);
            } else {
              Alert.alert("알림", "알림 권한이 허용되지 않았습니다.");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert("탈퇴 완료", "가상 데이터이므로 실제 탈퇴는 수행되지 않습니다.");
    await logout();
  };

  return (
    <ScrollView style={styles.container}>

      {/* 별 배경 */}
      <View style={styles.starsContainer}>
        {Array.from({ length: 80 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                transform: [
                  { translateX: Math.random() * 380 },
                  { translateY: Math.random() * 900 },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      {/* 내용 */}
      <View style={styles.innerContainer}>

        {/* 프로필 */}
        <View style={styles.profileSection}>
          <Text style={styles.profileEmoji}>🦥</Text>
          <Text style={styles.profileName}>{nick}님</Text>
          <Text style={styles.profileDesc}>편안한 수면을 즐기고 계세요</Text>
        </View>

        {/* 캘린더 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CalendarIcon size={26} color="#5b6fb9" />
            <Text style={styles.cardTitle}>수면 캘린더</Text>
          </View>

          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#5b6fb9" },
            }}
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              dayTextColor: "#fff",
              monthTextColor: "#fff",
              arrowColor: "#5b6fb9",
              selectedDayTextColor: "#fff",
              todayTextColor: "#7b8fc9",
            }}
          />
        </View>

        {/* ⭐ 하루 기록 출력 ⭐ */}
        <View style={styles.dayRecordCard}>
          <Text style={styles.dayRecordTitle}>📅 하루 기록</Text>

          <Text style={styles.dayRecordText}>
            수면 시간: {dailyData.sleep}
          </Text>
          <Text style={styles.dayRecordText}>
            스크린타임: {dailyData.screentime}
          </Text>
          <Text style={styles.dayRecordText}>
            카페인: {dailyData.caffeine}
          </Text>
        </View>

        {/* 알림 설정 */}
        <View style={styles.card}>
          <View style={styles.rowButton}>
            <View style={styles.rowLeft}>
              <Bell size={26} color="#5b6fb9" />
              <Text style={styles.rowText}>앱 알림 설정</Text>
            </View>

            <Switch
              value={allowNoti}
              onValueChange={handleNotificationToggle}
            />
          </View>
        </View>

        {/* 로그아웃 / 탈퇴 */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            style={styles.rowButtonBorder}
          >
            <View style={styles.rowLeft}>
              <LogOut size={26} color="#5b6fb9" />
              <Text style={styles.rowText}>로그아웃</Text>
            </View>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowDeleteModal(true)}
            style={styles.deleteButton}
          >
            <View style={styles.rowLeft}>
              <UserX size={26} color="#ef4444" />
              <Text style={styles.deleteText}>회원탈퇴</Text>
            </View>
            <Text style={styles.deleteArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>좋은 수면 습관을 유지하세요 ✨</Text>
        </View>
      </View>
    </ScrollView>
  );
}
