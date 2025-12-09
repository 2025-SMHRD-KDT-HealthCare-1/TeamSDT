import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "transparent",  // ⭐ 밤배경 유지!! 절대 색 넣지 말기
    position: "relative",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.1)",   // ⭐ 다크 배경과 어울리는 반투명 흰색
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  button: {
    backgroundColor: "#3B82F6",   // 로그인과 동일한 밝은 파란색
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  link: {
    marginTop: 22,
    textAlign: "center",
    color: "#A5B4FC",
    fontSize: 15,
  },
});
