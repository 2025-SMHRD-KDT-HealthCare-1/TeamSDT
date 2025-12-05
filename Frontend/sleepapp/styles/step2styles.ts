import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
    padding: 25,
    paddingTop: 80,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },

  desc: {
    color: "#b4bfd9",
    textAlign: "center",
    marginBottom: 30,
  },

  /* 권한 박스 */
  box: {
    backgroundColor: "#141b2e",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },

  /* 체크박스 + 글자 한 줄 */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 8,
  },

  label: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },

  /* 다음 버튼 */
  startBtn: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 40,
  },

  startText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#3e4f93",
  },

  /* 비활성화 버튼 UI */
  disabledBtn: {
    opacity: 0.4,
  },
});
