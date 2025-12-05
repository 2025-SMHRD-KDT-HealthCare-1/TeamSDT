import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* ⭐ 헤더 */
  header: {
    backgroundColor: "#3e4f93",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: {
    color: "#cdd5f3",
    fontSize: 15,
    fontWeight: "300",
  },

  username: {
    color: "white",
    fontSize: 26,
    fontWeight: "500",
    marginTop: 2,
  },

  headerIconBox: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#ffffff33",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ⭐ 카드 공통 */
  card: {
    backgroundColor: "rgba(20, 27, 46, 0.92)",
    borderRadius: 28,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
    marginBottom: 26,
    overflow: "hidden",
  },

  cardHeader: {
    backgroundColor: "#3e4f93",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },

  cardHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
  },

  cardBody: {
    padding: 20,
    gap: 20,
  },

  /* ⭐ 수면 시간 행 */
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: "#1a2040",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    color: "#b4bfd9",
    fontSize: 14,
  },

  mainValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },

  /* ⭐ 수면 점수 배지 */
  qualityBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  qualityText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },

  /* ⭐ 잠든 시간/기상 시간 박스 */
  timeBox: {
    backgroundColor: "#141b2e",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  timeItem: {
    flex: 1,
  },

  timeLabel: {
    color: "#b4bfd9",
    marginBottom: 6,
  },

  timeValue: {
    color: "#dbe4ff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* ⭐ 사용시간 · 카페인 */
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a2040",
    padding: 16,
    borderRadius: 18,
  },

  statLabel: {
    color: "#cdd5f3",
    flex: 1,
    fontSize: 15,
  },

  statValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  /* ⭐ AI 카드 */
  aiCard: {
    backgroundColor: "#3e4f93",
    padding: 20,
    borderRadius: 28,
    marginTop: 10,
  },

  aiRow: {
    flexDirection: "row",
    gap: 14,
  },

  aiIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: "#ffffff22",
    justifyContent: "center",
    alignItems: "center",
  },

  aiTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 6,
  },

  aiText: {
    color: "#e3e9ff",
    fontSize: 15,
    lineHeight: 21,
  },

  aiButton: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  aiButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },

  /* ⭐ 하단 캐릭터 */
  bottomCharacter: {
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 80,
  },

  characterEmoji: {
    fontSize: 60,
  },

  bottomMessage: {
    color: "#b4bfd9",
    fontSize: 16,
    marginTop: 8,
  },
});
