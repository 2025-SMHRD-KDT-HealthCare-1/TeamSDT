import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
  },

  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: -1,
  },

  star: {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "#ffffffaa",
  },

  header: {
    backgroundColor: "#3e4f93",
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "300",
  },

  innerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  characterWrap: {
    alignItems: "center",
    paddingVertical: 30,
  },

  characterEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },

  characterText: {
    color: "#b4bfd9",
    fontSize: 20,
    fontWeight: "300",
  },

  card: {
    backgroundColor: "rgba(20, 27, 46, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
    padding: 24,
    borderRadius: 30,
    marginBottom: 40,
  },

  label: {
    color: "#b4bfd9",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 4,
  },

  subLabel: {
    color: "#5b6fb9",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "300",
    marginBottom: 14,
  },

  timeBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#1a2040",
    borderWidth: 2,
    borderColor: "#5b6fb9",
    padding: 30,
    borderRadius: 30,
  },

  icon: {
    opacity: 0.9,
  },

  iconDelay: {
    opacity: 0.9,
  },

  timeInput: {
    color: "white",
    fontSize: 42,
    textAlign: "center",
    fontWeight: "200",
    width: 140,
  },

  bottomText: {
    marginTop: 16,
    textAlign: "center",
    color: "#7b8fc9",
    fontSize: 16,
    fontWeight: "300",
  },

  sleepPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#2d3561",
  },

  sleepCenter: {
    paddingHorizontal: 20,
    alignItems: "center",
  },

  sleepHour: {
    fontSize: 36,
    color: "white",
    fontWeight: "300",
  },

  saveBtn: {
    marginTop: 20,
    backgroundColor: "#5b6fb9",
    paddingVertical: 24,
    borderRadius: 30,
    alignItems: "center",
  },

  saveBtnText: {
    color: "white",
    fontSize: 26,
    fontWeight: "400",
  },
});
