import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./api/apiconfig";
import styles from "../styles/loginstyles";
import StarsBackground from "../components/starsbackground"; 

export default function Login() {
  const router = useRouter();

  // ⭐ 변수명 통일
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert("알림", "아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      // ⭐ 백엔드 요구사항: userid 로 보내야 함!
      const res = await api.post("/user/login", {
        userid: userId,
        password: password,
      });

      if (res.data.token) {
        await AsyncStorage.setItem("token", res.data.token);
        await AsyncStorage.setItem("user_id", res.data.userid); // ⭐ 백엔드에서 userid 응답함

        Alert.alert("로그인 성공!", `${userId}님 환영합니다!`);
        router.replace("/intro");
        return;
      }

      Alert.alert("로그인 실패", res.data.message || "아이디 또는 비밀번호 오류");
    } catch (err: any) {
      if (err.response?.data?.message) {
        Alert.alert("로그인 실패", err.response.data.message);
      } else {
        Alert.alert("오류", "서버 연결 실패");
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A1124" }}>

      {/* ⭐ 별 배경 */}
      <StarsBackground />

      {/* ⭐ 로그인 UI */}
      <View style={styles.container}>
        <Text style={styles.title}>로그인</Text>

        {/* 아이디 입력 */}
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#64748B"
          value={userId}
          onChangeText={setUserId}
        />

        {/* 비밀번호 입력 */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        {/* 하단 옵션 */}
        <View style={styles.optionsRow}>
          <TouchableOpacity onPress={() => router.push("/join")}>
            <Text style={styles.link}>회원가입</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/find-id")}>
            <Text style={styles.link}>아이디 찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/find-pw")}>
            <Text style={styles.link}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
