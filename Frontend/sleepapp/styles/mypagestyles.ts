import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#2d3e82",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  content: {
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: 24,
    elevation: 3,
  },

  /* --- 프로필 상단 --- */
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2d3e82",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 6,
  },

  profileEditBtn: {
    paddingVertical: 4,
  },

  profileEditText: {
    color: "#2d3e82",
    fontSize: 14,
    fontWeight: "500",
  },

  /* --- 정보 라인 --- */
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  infoLabel: {
    color: "#6b7280",
    fontSize: 14,
  },

  infoValue: {
    color: "#111",
    fontSize: 14,
    fontWeight: "500",
  },

  /* --- 섹션 타이틀 --- */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
    marginTop: 10,
  },

  /* --- 설정 버튼 --- */
  settingBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#111",
  },

  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  /* --- 캐릭터 안내 박스 --- */
  characterBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 30,
  },

  characterEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  characterText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
