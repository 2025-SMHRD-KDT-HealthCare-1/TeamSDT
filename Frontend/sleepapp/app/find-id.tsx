import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/findidstyles";
import api from "./api/apiconfig";

export default function FindId() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleFindId = async () => {
    if (!email.trim()) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }

    try {
      const res = await api.post("/user/find-id", { email });

      if (res.data.user_id) {
        Alert.alert("아이디 조회 성공", `회원님의 아이디는 "${res.data.user_id}" 입니다.`);
      } else {
        Alert.alert("오류", res.data.message || "아이디를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("오류", "서버 연결 실패 또는 네트워크 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>아이디 찾기</Text>

      <TextInput
        style={styles.input}
        placeholder="가입 시 사용한 이메일 입력"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleFindId}>
        <Text style={styles.buttonText}>아이디 찾기</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.link}>로그인으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}
