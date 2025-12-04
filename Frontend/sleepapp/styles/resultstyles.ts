import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1529",
  },

  // ✅ 탭 (높이 줄여서 터치 안 씹히게)
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#354B85",
    paddingVertical: 6,   // ✅ 기존 10 → 6
  },
  tabBtn: {
    paddingVertical: 4,   // ✅ 기존 6 → 4
    paddingHorizontal: 16, // ✅ 기존 20 → 16
    borderRadius: 20,
  },
  tabText: {
    color: "#C7CEFF",
    fontSize: 15,
  },
  tabSelected: {
    backgroundColor: "#1E2E5A",
  },
  tabSelectedText: {
    color: "white",
    fontWeight: "bold",
  },

  // ✅ 그래프 영역
  graphContainer: {
    padding: 12,    // ✅ 기존 15 → 12
    alignItems: "center",
  },
  graphTitle: {
    color: "#C7CEFF",
    fontSize: 16,
    marginBottom: 10,
  },
  graphPlaceholder: {
    color: "#6F7DA3",
    fontSize: 14,
  },

  // ✅ 막대 그래프 스타일 (간격 + 잘림 전부 해결)
 barChartWrapper: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "flex-end",
  height: 180,
  width: "100%",
  backgroundColor: "#101B3C",
  borderRadius: 16,     // ✅ 더 둥글게
  paddingHorizontal: 8,
  paddingBottom: 12,

  // ✅ 카드 느낌 핵심
  shadowColor: "#6EA8FE",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 6,        // ✅ 안드로이드 그림자
},


  barItem: {
    alignItems: "center",
    flex: 1,
  },

  bar: {
    width: 12,            // ✅ 기존 16 → 12
    backgroundColor: "#6EA8FE", // ✅ 기본 색 (동적 컬러는 TSX에서 적용)
    borderRadius: 6,
  },

  barLabel: {
    color: "#C7CEFF",     // ✅ 요일 기본 색
    fontSize: 12,
    marginTop: 6,
  },

  barValue: {
    color: "white",      // ✅ 시간 기본 색
    fontSize: 11,
    marginTop: 2,
  },

  // ✅ AI 분석 박스
  aiBox: {
    marginTop: 25,
    marginHorizontal: 15,
    backgroundColor: "#4B6BCE",
    padding: 15,
    borderRadius: 12,
  },
  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  aiIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  aiTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  aiText: {
    marginTop: 8,
    color: "white",
    fontSize: 15,
    lineHeight: 22,
  },

  // ✅ 하단
  footerSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  footerText: {
    color: "#C7CEFF",
    fontSize: 16,
  },
});
