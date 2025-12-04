import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0A1124", // 딥네이비
    paddingTop: 70,
  },

  // 로고 + 제목 영역
  logoArea: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffff",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  // 라벨
  label: {
    fontSize: 15,
    color: "#CBD5E1",
    marginBottom: 8,
    marginTop: 20,
  },

  // 입력창
  input: {
    backgroundColor: "#0B1324",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#ffffff",

    borderWidth: 1,
    borderColor: "#1E293B", // 은은한 라인
  },

  // 중복확인 버튼 / 본인인증 버튼 같은 작은 버튼
  smallBtn: {
    backgroundColor: "#FFFFFF22", // 반투명 화이트
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },

  smallBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  // 큰 버튼(회원가입 완료)
  btn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#3B82F6",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },

  btnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  // 뒤로가기 버튼
  backBtn: {
    marginTop: 24,
    alignSelf: "center",
  },

  backBtnText: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },

  // input + small button 옆으로 배치할 때 쓰는 row
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
