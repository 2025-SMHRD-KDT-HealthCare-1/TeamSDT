import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fc" },

  /* Header */
  header: {
    backgroundColor: "#2d3e82",
    padding: 24,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  welcome: { color: "white", fontSize: 16, marginBottom: 4 },
  userName: { color: "white", fontSize: 22, fontWeight: "bold" },
  headerIcon: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },

  /* Card */
  card: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    backgroundColor: "#2d3e82",
    padding: 16,
  },
  cardHeaderText: {
    color: "white",
    fontSize: 16,
  },
  cardBody: { padding: 20 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  row: { flexDirection: "row", alignItems: "center", gap: 10 },

  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: "#f5f7fc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },

  label: { color: "#6b7280", marginBottom: 2 },
  value: { color: "#2d3e82", fontSize: 16 },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  timeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  timeBox: {
    backgroundColor: "#f5f7fc",
    padding: 16,
    borderRadius: 16,
    width: "48%",
  },

  infoBox: {
    backgroundColor: "#f5f7fc",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  infoLabel: { marginLeft: 8, fontSize: 14 },
  infoValue: { color: "#2d3e82", fontSize: 14 },

  /* AI card */
  aiCard: {
    backgroundColor: "#4a5fa8",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  aiIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  aiTitle: { color: "white", fontSize: 18, marginBottom: 6 },
  aiText: { color: "white", opacity: 0.9, lineHeight: 20 },

  aiButton: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  aiButtonText: { color: "white", marginLeft: 6 },

  /* Bottom */
  characterBox: { alignItems: "center", marginVertical: 30 },
  characterEmoji: { fontSize: 50, marginBottom: 6 },
  characterText: { color: "#6b7280", fontSize: 16 },
});
