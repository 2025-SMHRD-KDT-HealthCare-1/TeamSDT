import { StyleSheet } from "react-native";

export default StyleSheet.create({
  /** ⭐ 별 배경 */
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "transparent",
  },

  /** 로딩 */
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#b4bfd9",
    marginTop: 10,
    fontSize: 16,
  },

  /** HEADER */
  header: {
    marginTop: 10,
    backgroundColor: "#3e4f93",
    padding: 26,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  headerWelcome: {
    color: "#c8d3ff",
    fontSize: 16,
  },

  headerName: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginTop: 6,
  },

  headerIconBox: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  /** CARD */
  card: {
    backgroundColor: "rgba(20,27,46,0.9)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(45,53,97,0.4)",
    marginBottom: 26,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  label: {
    color: "#d1d9ff",
    fontSize: 16,
  },

  value: {
    color: "#7aa2ff",
    fontSize: 17,
    fontWeight: "600",
  },

  smallLabel: {
    color: "#b4bfd9",
    fontSize: 14,
  },

  smallValue: {
    color: "#9fb3ff",
    fontSize: 14,
  },

  /** Footer */
  bottomSection: {
    marginVertical: 40,
    alignItems: "center",
  },

  bottomEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },

  bottomText: {
    color: "#8b95b7",
    fontSize: 16,
  },
});
