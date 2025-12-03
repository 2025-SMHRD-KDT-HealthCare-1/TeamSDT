import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
    justifyContent: "center",
    padding: 30,
  },

  skip: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  skipText: {
    color: "#fff",
  },

  logo: {
    fontSize: 100,
    textAlign: "center",
  },

  title: {
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
    fontSize: 28,
  },

  desc: {
    color: "#b4bfd9",
    textAlign: "center",
    marginTop: 15,
    fontSize: 18,
  },

  /* 체크박스 구역 */
  checkboxContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkLabel: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 12,
  },

  nextBtn: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 40,
  },
  nextText: {
    textAlign: "center",
    fontSize: 18,
    color: "#3e4f93",
  },
});
