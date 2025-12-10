import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/findpwstyles";
import api from "./api/apiconfig";

export default function FindPw() {
  const router = useRouter();
  const [userid, setuserid] = useState("");
  const [email, setEmail] = useState("");

  const handleFindPw = async () => {
    if (!userid.trim() || !email.trim()) {
      Alert.alert("알림", "아이디와 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await api.post("/user/reset-password", {
        userid: userid,
        email,
      });

      if (res.data.tempPassword) {
        Alert.alert(
          "임시 비밀번호 발급 성공",
          `임시 비밀번호: ${res.data.tempPassword}`
        );
      } else {
        Alert.alert("오류", res.data.message || "정보가 일치하지 않습니다.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("오류", "서버 연결 실패 또는 네트워크 오류");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호 찾기</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디 입력"
        placeholderTextColor="#aaa"
        onChangeText={setuserid}
      />

      <TextInput
        style={styles.input}
        placeholder="가입 이메일 입력"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleFindPw}>
        <Text style={styles.buttonText}>임시 비밀번호 발급</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.link}>로그인으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}
