import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./apiconfig";
import styles from "../styles/loginstyles";

export default function Login() {
  const router = useRouter();
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!user_id || !password) {
      Alert.alert("알림", "아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await api.post("/user/login", {
        user_id,
        password,
      });

      if (res.data.token) {
        await AsyncStorage.setItem("token", res.data.token);

        Alert.alert("로그인 성공!", `${user_id}님 환영합니다!`);

        router.replace("/(tabs)/home");
      } else {
        Alert.alert("로그인 실패", res.data.message || "정보가 올바르지 않습니다.");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      Alert.alert("오류", "서버 연결 실패");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={(handleLogin) => router.push("/intro")}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

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
  );
}
