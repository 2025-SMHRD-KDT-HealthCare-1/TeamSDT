import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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

interface MyPageProps {
  userName: string;
  onLogout: () => void;
}

export default function MyPage({ userName, onLogout }: MyPageProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyData, setDailyData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- 더미 데이터 (추후 DB 연결 가능) ---
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

  // 날짜 선택 시 하루 기록 갱신
  useEffect(() => {
    if (!selectedDate) return;
    setDailyData(dummyData[selectedDate] || null);
  }, [selectedDate]);

  return (
    <ScrollView style={styles.container}>

      {/* ⭐ 별 배경 */}
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

      {/* 본문 */}
      <View style={styles.innerContainer}>

        {/* 프로필 */}
        <View style={styles.profileSection}>
          <Text style={styles.profileEmoji}>🦥</Text>
          <Text style={styles.profileName}>{userName}님</Text>
          <Text style={styles.profileDesc}>편안한 수면을 즐기고 계세요</Text>
        </View>

        {/* 달력 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CalendarIcon size={26} color="#5b6fb9" />
            <Text style={styles.cardTitle}>수면 캘린더</Text>
          </View>

          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#5b6fb9",
              },
            }}
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              dayTextColor: "#ffffff",
              monthTextColor: "#ffffff",
              arrowColor: "#5b6fb9",
              selectedDayTextColor: "#fff",
              todayTextColor: "#7b8fc9",
            }}
          />
        </View>

        {/* 하루 기록 카드 */}
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

        {/* 앱 알림 설정 */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowButton}>
            <View style={styles.rowLeft}>
              <Bell size={26} color="#5b6fb9" />
              <Text style={styles.rowText}>앱 알림 설정</Text>
            </View>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 로그아웃 + 회원탈퇴 */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={onLogout}
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

        {/* 하단 메시지 */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>좋은 수면 습관을 유지하세요 ✨</Text>
        </View>
      </View>

      {/* 회원탈퇴 모달 */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>회원탈퇴</Text>
            <Text style={styles.modalDesc}>
              정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  setShowDeleteModal(false);
                  onLogout();
                }}
              >
                <Text style={styles.deleteBtnLabel}>탈퇴하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
