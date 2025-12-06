import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1436",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    color: "#ffffff",
    marginBottom: 20,
    fontWeight: "600",
  },

  timer: {
    fontSize: 40,
    color: "#7ab9ff",
    fontWeight: "bold",
    marginBottom: 30,
  },

  desc: {
    fontSize: 18,
    color: "#cccccc",
    marginBottom: 50,
  },

  endBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  endBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
