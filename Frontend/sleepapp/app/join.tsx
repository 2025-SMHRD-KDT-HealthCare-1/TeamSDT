import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";

import { router } from "expo-router";   // ✅ 추가 (navigation 대신 router)
import api from "./api/apiconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/joinstyles";

export default function Join() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [checkDone, setCheckDone] = useState(false);

  // 🔥 아이디 중복 확인
  const checkDuplicate = async () => {
    if (!userId.trim()) return Alert.alert("아이디를 입력하세요");

    try {
      const res = await api.get(`/auth/check-id?user_id=${userId}`);
      console.log("중복확인 응답:", res.data);

      if (res.data.exists) {
        Alert.alert("중복된 아이디입니다!");
        setCheckDone(false);
      } else {
        Alert.alert("사용 가능한 아이디입니다!");
        setCheckDone(true);
      }
    } catch (err) {
      console.log("중복확인 오류:", err);
      Alert.alert("서버 오류", "중복확인 중 오류 발생");
    }
  };

  // 🔥 회원가입 요청
  const joinHandler = async () => {
    if (!checkDone) {
      return Alert.alert("아이디 중복확인을 먼저 해주세요!");
    }

    if (password !== passwordCheck) {
      return Alert.alert("비밀번호가 일치하지 않습니다.");
    }

    try {
      const res = await api.post("/auth/join", {
        user_id: userId,
        password,
        nick,
        email,
        phone,
      });

      Alert.alert("회원가입 성공", "로그인 화면으로 이동합니다.");

      // navigation.navigate("Login") ❌ (사용 불가)
      router.replace("/");   // ✅ Expo Router 방식으로 수정

    } catch (err) {
      console.log("회원가입 오류:", err.response?.data);
      Alert.alert("회원가입 실패", err.response?.data?.message || "서버 오류");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A1124" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>

            {/* 아이디 입력 + 중복확인 */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="아이디"
                placeholderTextColor="#64748B"
                value={userId}
                onChangeText={setUserId}
              />
              <TouchableOpacity style={styles.smallBtn} onPress={checkDuplicate}>
                <Text style={styles.smallBtnText}>중복확인</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={passwordCheck}
              onChangeText={setPasswordCheck}
            />

            <TextInput
              style={styles.input}
              placeholder="닉네임"
              placeholderTextColor="#64748B"
              value={nick}
              onChangeText={setNick}
            />

            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="전화번호"
              placeholderTextColor="#64748B"
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity style={styles.btn} onPress={joinHandler}>
              <Text style={styles.btnText}>회원가입</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace("/")}   // ✅ 수정
            >
              <Text style={styles.backBtnText}>로그인으로 돌아가기</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
