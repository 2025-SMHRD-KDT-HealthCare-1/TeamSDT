import StarsBackground from "./starsbackground";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function ProfileEdit() {
  return (
    <View style={styles.container}>
      <StarsBackground />

      <Text style={styles.title}>프로필 수정</Text>

      <TextInput style={styles.input} placeholder="닉네임 수정" placeholderTextColor="#fb6774" />
      <TextInput style={styles.input} placeholder="전화번호 수정" placeholderTextColor="#fb6774" />

      <TouchableOpacity
        style={styles.btn}       
        onPress={() => router.push("/(tabs)/myPage" as never)}
      >
        <Text style={styles.btnText}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
    padding: 30,
    justifyContent: "center",
  },
  title: { fontSize: 28, color: "white", marginBottom: 30, textAlign: "center" },
  input: {
    backgroundColor: "#141b2e",
    borderColor: "#2d3561",
    borderWidth: 1,
    height: 50,
    borderRadius: 15,
    color: "white",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#5b6fb9",
    paddingVertical: 15,
    borderRadius: 15,
  },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
