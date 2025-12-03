import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1529",
  },

  // 탭
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#354B85",
    paddingVertical: 10,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
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

  // 그래프 영역
  graphContainer: {
    padding: 15,
  },
  graphTitle: {
    color: "#C7CEFF",
    fontSize: 16,
    marginBottom: 10,
  },
  graphBox: {
    height: 200,
    backgroundColor: "#101B3C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  graphPlaceholder: {
    color: "#6F7DA3",
    fontSize: 14,
  },

  // AI 분석 박스
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

  // 하단
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
