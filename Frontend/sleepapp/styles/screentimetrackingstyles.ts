import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 16,
  },

  card: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 16,
  },

  cardTitle: {
    color: "#E5E7EB",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  totalTime: {
    color: "#BFDBFE",
    fontSize: 28,
    fontWeight: "800",
  },

  sectionTitle: {
    color: "#F3F4F6",
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "600",
  },

  appRow: {
    marginBottom: 16,
  },

  appLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  appName: {
    color: "#E5E7EB",
    fontSize: 14,
    marginBottom: 4,
  },

  appTime: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 6,
  },

  barContainer: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "#1F2937",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 999,
  },

  compareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  compareLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  compareIcon: {
    fontSize: 16,
    color: "#F3F4F6",
  },

  compareLabel: {
    color: "#E5E7EB",
    fontSize: 15,
  },

  compareValue: {
    fontSize: 15,
    fontWeight: "600",
  },

  red: {
    color: "#F87171",
  },

  green: {
    color: "#4ADE80",
  },

  bottomNotice: {
    alignItems: "center",
    marginTop: 10,
  },

  bottomText: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 20,
  },

  noDataText: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 30,
  },

  noDataSubText: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
});
