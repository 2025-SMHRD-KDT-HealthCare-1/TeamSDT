import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0A1124"   // 전체 딥네이비
  },

  /* Header */
  header: {
    padding: 26,
    paddingTop: 60,
    backgroundColor: "#0F162D",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },

  welcome: { 
    color: "#94A3B8", 
    fontSize: 15, 
    marginBottom: 4 
  },

  userName: { 
    color: "#ffffff", 
    fontSize: 24, 
    fontWeight: "700" 
  },

  headerIcon: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },

  /* Card */
  card: {
    backgroundColor: "#0F162D",
    marginHorizontal: 20,
    marginTop: 26,
    borderRadius: 20,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeader: {
    backgroundColor: "#1C2A47",
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  cardHeaderText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },

  cardBody: {
    padding: 20,
    backgroundColor: "#0F162D",
  },

  /* Row */
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10 
  },

  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: "#1A2236",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },

  label: { 
    color: "#CBD5E1", 
    fontSize: 14,
    marginBottom: 2 
  },

  value: { 
    color: "#3B82F6", 
    fontSize: 17, 
    fontWeight: "600" 
  },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#1E293B",
    borderRadius: 20,
  },

  timeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 14,
  },

  timeBox: {
    backgroundColor: "#1A2236",
    padding: 16,
    borderRadius: 16,
    width: "48%",
  },

  infoBox: {
    backgroundColor: "#1A2236",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  infoLabel: { 
    color: "#CBD5E1", 
    fontSize: 14 
  },

  infoValue: { 
    color: "#3B82F6", 
    fontSize: 14,
    fontWeight: "600" 
  },

  /* AI 카드 */
  aiCard: {
    backgroundColor: "#1C2A47",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
  },

  aiIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  aiTitle: { 
    color: "#ffffff", 
    fontSize: 18, 
    fontWeight: "600",
    marginBottom: 6 
  },

  aiText: { 
    color: "#CBD5E1", 
    opacity: 0.9, 
    lineHeight: 20 
  },

  aiButton: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  aiButtonText: { 
    color: "#ffffff", 
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 6 
  },

  /* Bottom */
  characterBox: { 
    alignItems: "center", 
    marginVertical: 30 
  },

  characterEmoji: { 
    fontSize: 50, 
    marginBottom: 6 
  },

  characterText: { 
    color: "#64748B", 
    fontSize: 16 
  },
});
