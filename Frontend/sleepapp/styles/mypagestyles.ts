import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
  },

  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  star: {
    position: "absolute",
    backgroundColor: "#ffffffaa",
    borderRadius: 50,
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

  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },

  profileEmoji: { fontSize: 80 },
  profileName: { color: "white", fontSize: 26, marginTop: 10 },
  profileDesc: { color: "#b4bfd9", fontSize: 16, marginTop: 4 },

  card: {
    backgroundColor: "rgba(20, 27, 46, 0.9)",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
    marginBottom: 30,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "400",
  },

  calendarButton: {
    backgroundColor: "#1a2040",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  calendarButtonText: {
    color: "white",
    fontSize: 16,
  },

  rowButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 4,
  },

  rowButtonBorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2d3561",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    color: "white",
    fontSize: 18,
  },

  rowArrow: {
    color: "#b4bfd9",
    fontSize: 24,
  },

  deleteButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },

  deleteText: { color: "#ef4444", fontSize: 18 },
  deleteArrow: { color: "#ef4444", fontSize: 24 },

  bottomSection: { alignItems: "center", paddingVertical: 30 },
  bottomText: { color: "#7b8fc9", fontSize: 18 },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#141b2e",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2d3561",
  },

  modalTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  modalDesc: { color: "#b4bfd9", fontSize: 16, marginVertical: 16 },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2d3561",
    marginRight: 10,
  },

  cancelBtnText: { color: "#b4bfd9", textAlign: "center" },

  deleteBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    marginLeft: 10,
  },

  deleteBtnLabel: {
    color: "white",
    textAlign: "center",
  },
});
