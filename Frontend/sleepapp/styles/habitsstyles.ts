// styles/habits.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0A0D1A",
    paddingTop: 55,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
  },

  tabWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#151B2E",
    borderRadius: 14,
    padding: 5,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#9BA3B0",
    fontWeight: "500",
  },

  tabActive: {
    backgroundColor: "#334155",
  },
  tabActiveText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
