import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
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
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyData, setDailyData] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [nick, setNick] = useState<string>(userName);
  const [user, setUser] = useState<any>(null);

  const [allowNoti, setAllowNoti] = useState(false);

  // -----------------------------------------
  // 🚀 가상 유저 정보 (fetchMyInfo 대체)
  // -----------------------------------------
  const fakeUser = {
    user_id: "fake-user-123",
    nick: "테스트유저",
    email: "test@example.com",
  };

  // -----------------------------------------
  // 🚀 가상 하루 기록
  // -----------------------------------------
  const dummyData: any = {
    "2025-02-01": {
      sleep: "7시간 30분",
      screentime: "3시간 15분",
      caffeine: "150mg",
    },
    "2025-02-05": {
      sleep: "6시간 20분",
      screentime: "2시간 40분",
      caffeine: "없음",
    },
  };

  // ⭐ 앱 시작 시 오늘 날짜 선택 + 유저 정보 로딩
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    // 🚀 API 대신 즉시 가상 유저 주입
    setNick(fakeUser.nick);
    setUser(fakeUser);
  }, []);

  // ⭐ 날짜 선택 시 데이터 로딩
  useEffect(() => {
    if (!selectedDate) return;

    loadDailyCaffeine(selectedDate);

    if (dummyData[selectedDate]) {
      setDailyData({
        sleep: dummyData[selectedDate].sleep,
        screentime: dummyData[selectedDate].screentime,
        caffeine:
          dummyData[selectedDate].caffeine || dailyData?.caffeine || "기록 없음",
      });
    } else {
      setDailyData({
        sleep: null,
        screentime: null,
        caffeine: dailyData?.caffeine || "기록 없음",
      });
    }
  }, [selectedDate]);

  // ⭐ 저장된 카페인 기록 불러오기 (로컬만 남김)
  const loadDailyCaffeine = async (date: string) => {
    try {
      const saved = await AsyncStorage.getItem("daily_caffeine_records");
      if (!saved) {
        setDailyData((prev: any) => ({
          ...prev,
          caffeine: dummyData[date]?.caffeine ?? "기록 없음",
        }));
        return;
      }

      const data = JSON.parse(saved);
      const records = data[date];

      if (!records || records.length === 0) {
        setDailyData((prev: any) => ({
          ...prev,
          caffeine: dummyData[date]?.caffeine ?? "기록 없음",
        }));
        return;
      }

      const caffeineTotal = records.reduce(
        (sum: number, r: any) => sum + r.caffeine,
        0
      );

      setDailyData((prev: any) => ({
        ...prev,
        caffeine: `${caffeineTotal}mg`,
      }));
    } catch (err) {
      console.log("날짜별 카페인 불러오기 오류:", err);
    }
  };

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
              setAllowNoti(false);
              Alert.alert("알림", "알림 권한이 허용되지 않았습니다.");
            }
          },
        },
      ]
    );
  };

  // ⭐ 회원탈퇴 – 실제 API 없이 가상 처리
  const handleDeleteAccount = async () => {
    Alert.alert("탈퇴 완료", "가상 데이터이므로 실제 탈퇴는 수행되지 않습니다.");
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <View style={styles.innerContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.profileEmoji}>🦥</Text>
          <Text style={styles.profileName}>{nick}님</Text>
          <Text style={styles.profileDesc}>편안한 수면을 즐기고 계세요</Text>
        </View>

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

        <View style={styles.dayRecordCard}>
          <Text style={styles.dayRecordTitle}>📅 하루 기록</Text>

          {!dailyData ? (
            <Text style={styles.noDataText}>기록이 없습니다.</Text>
          ) : (
            <>
              <Text style={styles.dayRecordText}>
                수면 시간: {dailyData.sleep || "기록 없음"}
              </Text>
              <Text style={styles.dayRecordText}>
                스크린타임: {dailyData.screentime || "기록 없음"}
              </Text>
              <Text style={styles.dayRecordText}>
                카페인: {dailyData.caffeine || "기록 없음"}
              </Text>
            </>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.rowButton}>
            <View style={styles.rowLeft}>
              <Bell size={26} color="#5b6fb9" />
              <Text style={styles.rowText}>앱 알림 설정</Text>
            </View>

            <Switch
              value={allowNoti}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#777", true: "#5b6fb9" }}
              thumbColor={allowNoti ? "#ffffff" : "#f4f3f4"}
            />
          </View>
        </View>

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

      {/* 로그아웃 모달 */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>로그아웃</Text>
            <Text style={styles.modalDesc}>정말 로그아웃 하시겠습니까?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={logout}>
                <Text style={styles.deleteBtnLabel}>로그아웃</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 회원탈퇴 모달 */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>회원탈퇴</Text>
            <Text style={styles.modalDesc}>정말로 탈퇴하시겠습니까?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                <Text style={styles.deleteBtnLabel}>탈퇴하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
