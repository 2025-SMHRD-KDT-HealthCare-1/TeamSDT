import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fc",
  },

  header: {
    backgroundColor: "#2d3e82",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    padding: 20,
    marginTop: -20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2d3e82",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  profileName: {
    fontSize: 18,
    color: "#1a1f36",
    marginBottom: 6,
  },

  profileEditBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#2d3e82",
    borderRadius: 10,
  },

  profileEditText: {
    color: "#2d3e82",
    fontSize: 13,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  infoLabel: {
    color: "#6b7280",
  },

  infoValue: {
    color: "#1a1f36",
    fontWeight: "500",
  },

  sectionTitle: {
    color: "#1a1f36",
    fontSize: 15,
    marginBottom: 8,
    marginLeft: 6,
  },

  settingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  settingBorder: {
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  settingText: {
    color: "#1a1f36",
    fontSize: 15,
  },
  characterBox: {
    alignItems: "center",
    paddingVertical: 20,
  },

  characterEmoji: {
    fontSize: 50,
    marginBottom: 4,
  },

  characterText: {
    color: "#6b7280",
  },
});
