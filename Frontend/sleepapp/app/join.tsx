import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import styles from "../styles/joinstyles";
import { useRouter } from "expo-router";
import api from "./api/apiconfig";

export default function Join() {
  const router = useRouter();

  const [user_id, setUserId] = useState("");
  const [password, setPw] = useState("");
  const [password2, setPw2] = useState("");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 🔥 아이디 중복확인 API
  const onCheckId = async () => {
    if (!user_id.trim()) {
      return Alert.alert("알림", "아이디를 입력하세요.");
    }

    try {
      const res = await api.get("/user/check-id", {
        params: { user_id },
      });

      if (res.data.exists) {
        Alert.alert("중복됨", "이미 존재하는 아이디입니다.");
      } else {
        Alert.alert("사용 가능", "사용 가능한 아이디입니다!");
      }
    } catch (err) {
      console.log("CHECK ID ERROR:", err);
      Alert.alert("오류", "중복확인 중 서버 오류가 발생했습니다.");
    }
  };

  const onJoin = async () => {
    if (!user_id || !password || !password2 || !nick || !email || !phone) {
      Alert.alert("알림", "모든 항목을 입력해주세요.");
      return;
    }

    if (password !== password2) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await api.post("/user/join", {
        user_id,
        password,
        nick,
        email,
        phone,
      });

      if (res.data.message === "회원가입 성공") {
        Alert.alert("완료", "회원가입 성공!", [
          { text: "로그인 하기", onPress: () => router.push("/") },
        ]);
        
      } else {
        Alert.alert("실패", res.data.message);
      }
    } catch (err) {
      console.log("JOIN ERROR:", err);
      Alert.alert("오류", "회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>회원가입</Text>

        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={user_id}
          onChangeText={setUserId}
        />

        <TouchableOpacity style={styles.smallBtn} onPress={onCheckId}>
          <Text style={styles.smallBtnText}>중복확인</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPw}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry
          value={password2}
          onChangeText={setPw2}
        />

        <TextInput
          style={styles.input}
          placeholder="닉네임"
          value={nick}
          onChangeText={setNick}
        />

        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="전화번호"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.btn} onPress={onJoin}>
          <Text style={styles.btnText}>회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/")}>
          <Text style={styles.backBtnText}>로그인으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
