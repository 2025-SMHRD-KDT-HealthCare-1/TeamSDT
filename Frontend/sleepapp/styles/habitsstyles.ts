import { StyleSheet } from "react-native";

export default StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#0A0D1A",
  },

  /** ⭐ 별 배경 */
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  /** HEADER */
  header: {
    backgroundColor: "rgba(62,79,147,0.85)",   // ⭐ 약간 투명하게 변경
    padding: 24,
    borderRadius: 20,
    margin: 20,
    alignItems: "center",
  },

  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },

  /** 탭 영역 */
  tabWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",  // ⭐ 투명
    borderRadius: 12,
    padding: 6,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },

  tabActive: {
    backgroundColor: "rgba(110,168,254,0.25)", // ⭐ 하이라이트
  },

  tabText: {
    fontSize: 16,
    color: "#b4bfd9",
  },

  tabActiveText: {
    color: "#7aa2ff",
    fontWeight: "600",
  },

});
