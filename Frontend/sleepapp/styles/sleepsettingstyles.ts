import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },

  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "600",
  },

  timeBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 14,
    borderRadius: 12,
  },

  timeText: {
    color: "white",
    fontSize: 18,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  optionLabel: {
    color: "white",
    fontSize: 16,
  },

  startBtn: {
    backgroundColor: "#6C77F4",
    padding: 15,
    borderRadius: 14,
    marginTop: 25,
    alignItems: "center",
  },

  startBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
