import { StyleSheet } from "react-native";

export default StyleSheet.create({
  /** 전체 배경 */
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0a0d1a",
  },

  /** ⭐ 별 배경 */
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  /** 공통 카드 */
  card: {
    backgroundColor: "rgba(20, 27, 46, 0.9)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
    marginBottom: 26,
  },

  /** 카드 상단 헤더 */
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },

  cardIcon: {
    fontSize: 24,
    color: "#b4bfd9",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "white",
  },

  /** 필드 묶음 */
  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: "#b4bfd9",
    marginBottom: 6,
  },

  /** 드롭다운 선택박스 */
  selectBox: {
    borderWidth: 1,
    borderColor: "rgba(45,53,97,0.6)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "rgba(15, 20, 36, 0.8)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectPlaceholder: {
    color: "#667199",
    fontSize: 15,
  },

  selectText: {
    color: "white",
    fontSize: 15,
  },

  selectArrow: {
    fontSize: 16,
    color: "#b4bfd9",
  },

  /** 드롭다운 내부 목록 */
  dropdown: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(45,53,97,0.4)",
    backgroundColor: "rgba(20, 27, 46, 0.95)",
  },

  dropdownItem: {
    padding: 14,
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#e0e6ff",
  },

  /** 시간 입력 */
  inputBox: {
    borderWidth: 1,
    borderColor: "rgba(45,53,97,0.6)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "rgba(15, 20, 36, 0.8)",
    fontSize: 15,
    color: "white",
  },

  /** 카페인 표시 */
  caffeineBox: {
    marginTop: 10,
    paddingVertical: 10,
  },

  caffeineLabel: {
    fontSize: 14,
    color: "#8b95b7",
  },

  caffeineValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#7aa2ff",
    marginTop: 4,
  },

  /** 추가하기 버튼 */
  addButton: {
    marginTop: 10,
    backgroundColor: "#3e4f93",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14,
  },

  addButtonDisabled: {
    backgroundColor: "#2a335c",
  },

  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  /** 기록 없음 */
  emptyBox: {
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyEmoji: {
    fontSize: 32,
    marginBottom: 6,
    color: "#b4bfd9",
  },

  emptyText: {
    fontSize: 15,
    color: "#7b8fc9",
  },

  /** 기록 리스트 */
  list: {
    marginTop: 10,
  },

  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "rgba(45,53,97,0.3)",
  },

  recordLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  recordIcon: {
    fontSize: 20,
    color: "#b4bfd9",
  },

  recordTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },

  recordMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  recordMetaText: {
    fontSize: 12,
    color: "#8b95b7",
  },

  recordDot: {
    marginHorizontal: 6,
    color: "#667199",
  },

  /** 삭제 버튼 */
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  /** 총 카페인 박스 */
  totalBoxWrapper: {
    marginTop: 16,
    alignItems: "center",
  },

  totalBox: {
    backgroundColor: "rgba(20, 27, 46, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(45,53,97,0.4)",
  },

  totalLabel: {
    fontSize: 14,
    color: "#b4bfd9",
  },

  totalValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "700",
    color: "#7aa2ff",
  },

  /** 안내문 */
  noticeWrapper: {
    marginTop: 10,
    alignItems: "center",
    paddingBottom: 40,
  },

  noticeText: {
    fontSize: 12,
    color: "#7b8fc9",
  },
});
