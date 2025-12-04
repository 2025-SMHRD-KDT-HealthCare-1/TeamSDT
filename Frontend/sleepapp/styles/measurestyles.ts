import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#0A1124",   // 딥네이비 톤
    flex: 1,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 26,
    marginBottom: 10,
    fontWeight: "700",
  },

  // 시간 선택 박스 (수면시간, 기상시간)
  timeBtn: {
    backgroundColor: "#0B1324",     // 다크 input 스타일
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  timeText: {
    color: "#CBD5E1",
    fontSize: 18,
    fontWeight: "500",
  },

  // 옵션 (토글, 체크 등 row)
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",   // 은은한 라인
  },

  optionLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },

  // 측정 시작 버튼
  startBtn: {
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

  startBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
