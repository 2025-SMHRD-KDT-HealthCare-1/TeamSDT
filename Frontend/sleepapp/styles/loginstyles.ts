import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,

    // ⭐ 별이 보이도록 투명 처리
    backgroundColor: "transparent",

    // ⭐ StarsBackground zIndex 적용되도록
    position: "relative",

    justifyContent: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#0B1324",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#1E293B",
    marginTop: 18,
  },

  button: {
    backgroundColor: "#3B82F6",
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",

    shadowColor: "#3B82F6",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
    gap: 26,
  },

  link: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "500",
  }
});
