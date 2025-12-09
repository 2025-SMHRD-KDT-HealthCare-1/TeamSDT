import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
import api from "../api/apiconfig";
import * as Notifications from "expo-notifications";

import { logout } from "../logout";

interface MyPageProps {
  userName: string;
}

export default function MyPage({ userName }: MyPageProps) {
  const TODAY = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [dailyData, setDailyData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [nick, setNick] = useState<string>(userName);
  const [user, setUser] = useState<any>(null);
  const [allowNoti, setAllowNoti] = useState(false);

  // ✅ 사용자 정보 로드
  useEffect(() => {
    fetchMyInfo();
  }, []);

  // ✅ 날짜 or 유저 바뀌면 하루기록 갱신
  useEffect(() => {
    if (!user?.user_id) return;
    loadDailyAll(selectedDate);
  }, [selectedDate, user]);

  const fetchMyInfo = async () => {
    try {
      const res = await api.get("/user/me");
      setNick(res.data.nick);
      setUser(res.data);
    } catch (err) {
      console.log("사용자 정보 불러오기 실패:", err);
    }
  };

  /**
   * ✅ ✅ ✅ 날짜 기반 하루 기록 API 연동
   * GET /mypage/day/:userid/:date
   */
  const loadDailyAll = async (date: string) => {
    try {
      if (!user?.user_id) return;

      const userid = user.user_id;

      const res = await api.get(`/mypage/day/${userid}/${date}`);
      const data = res.data;

      setDailyData({
        sleep: data.sleep ?? "기록 없음",
        screentime: data.screentime ?? "기록 없음",
        caffeine: data.caffeine ?? "기록 없음",
      });
    } catch (err) {
      console.log("하루 기록 불러오기 오류:", err);
    }
  };

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

  const handleDeleteAccount = async () => {
    try {
      if (!user?.user_id) {
        Alert.alert("오류", "유저 정보를 불러오지 못했습니다.");
        return;
      }

      const res = await api.delete(`/user/delete/${user.user_id}`);
      console.log("회원탈퇴 완료:", res.data);

      Alert.alert("탈퇴 완료", "회원탈퇴가 완료되었습니다.");
      await logout();
    } catch (error) {
      console.log("회원탈퇴 오류:", error);
      Alert.alert("오류", "회원탈퇴 중 문제가 발생했습니다.");
    }
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <View style={styles.innerContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.profileEmoji}>🦥</Text>
          <Text style={styles.profileName}>
            {user ? `${nick}님` : "사용자님"}
          </Text>
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

        {/* ✅ ✅ ✅ 하루 기록 */}
        <View style={styles.dayRecordCard}>
          <Text style={styles.dayRecordTitle}>📅 하루 기록</Text>

          {!dailyData ? (
            <Text style={styles.noDataText}>기록이 없습니다.</Text>
          ) : (
            <>
              <Text style={styles.dayRecordText}>
                수면 시간: {dailyData.sleep}
              </Text>
              <Text style={styles.dayRecordText}>
                스크린타임: {dailyData.screentime}
              </Text>
              <Text style={styles.dayRecordText}>
                카페인: {dailyData.caffeine}
              </Text>
            </>
          )}
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
              trackColor={{ false: "#777", true: "#5b6fb9" }}
              thumbColor={allowNoti ? "#ffffff" : "#f4f3f4"}
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
