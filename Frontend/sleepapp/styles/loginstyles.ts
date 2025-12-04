import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 26,
    backgroundColor: "#0A1124",
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

  // 🔥 기존 코드와 호환되도록 label 추가
  label: {
    fontSize: 15,
    color: "#CBD5E1",
    marginTop: 30,
    marginBottom: 6,
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
  },

  // 🔥 기존 index.tsx 에서 사용하던 이름도 추가 (button)
  button: {
    backgroundColor: "#3B82F6",
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#3B82F6",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },

  // 🔥 기존 buttonText 도 추가
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  // 🔥 기존 optionsRow/ link 복구
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
  },

  // 🔥 "btn", "btnText"도 join.tsx에서 쓰므로 추가
  btn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 40,
    alignItems: "center",
  },

  btnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
