import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "transparent",
  },

  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "rgba(20, 27, 46, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
    alignItems: "center",
  },

  tabSelected: {
    backgroundColor: "#3e4f93",
    borderColor: "#6ea8fe",
  },

  tabText: {
    color: "#b4bfd9",
    fontSize: 16,
  },

  tabSelectedText: {
    color: "white",
    fontWeight: "600",
  },

  graphContainer: {
    marginTop: 10,
    backgroundColor: "rgba(20, 27, 46, 0.9)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
  },

  graphTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },

  graphPlaceholder: {
    textAlign: "center",
    color: "#8b95b7",
    fontSize: 15,
    paddingVertical: 20,
  },

  barChartWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
  },

  barItem: {
    alignItems: "center",
    width: 40,
  },

  bar: {
    width: 22,
    borderRadius: 10,
  },

  barLabel: {
    marginTop: 6,
    fontSize: 12,
  },

  barValue: {
    marginTop: 2,
    fontSize: 12,
  },

  aiBox: {
    marginTop: 26,
    backgroundColor: "rgba(20, 27, 46, 0.9)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
  },

  aiTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 14,
  },

  /* 🔥 추가된 부분 (오류 해결) */
  aiSectionTitle: {
    color: "#7aa2ff",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 6,
  },

  aiText: {
    color: "#e0e6ff",
    fontSize: 15,
    lineHeight: 22,
  },

  /** 하단 푸터 */
  footerSection: {
    marginVertical: 40,
    alignItems: "center",
  },

  emoji: {
    fontSize: 36,
    marginBottom: 6,
  },

  footerText: {
    color: "#8b95b7",
    fontSize: 16,
  },
});
