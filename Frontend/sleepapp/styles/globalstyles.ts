// styles/globalStyles.ts
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0d1a",
  },

  text: {
    color: "#ffffff",
    fontFamily: "NotoSansKR",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "NotoSansKR",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    marginVertical: 8,
    fontFamily: "NotoSansKR",
  },

  button: {
    backgroundColor: "#5b6fb9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "NotoSansKR",
  },

  card: {
    backgroundColor: "rgba(20, 27, 46, 0.7)",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(91, 111, 185, 0.2)",
    marginVertical: 8,
  },

  glass: {
    backgroundColor: "rgba(20, 27, 46, 0.55)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(91, 111, 185, 0.3)",
    padding: 20,
  },
});
