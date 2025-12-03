import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f7fc",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    backgroundColor: "white",
    borderColor: "#d7d7d7",
  },
  smallBtn: {
    backgroundColor: "#748bff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: 120,
    alignSelf: "flex-end",
  },
  smallBtnText: { color: "white", textAlign: "center" },
  btn: {
    backgroundColor: "#5b6dff",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  backBtn: { marginTop: 20 },
  backBtnText: { color: "#748bff", textAlign: "center" },
});
