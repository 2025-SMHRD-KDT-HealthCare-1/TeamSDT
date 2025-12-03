import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E5E7EB",
  },

  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#E5E7EB",
    marginBottom: 6,
  },

  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#020617",
  },
  selectText: {
    color: "#F9FAFB",
    fontSize: 14,
  },
  selectPlaceholder: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  selectArrow: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  dropdown: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#4B5563",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    color: "#E5E7EB",
    fontSize: 14,
  },

  caffeineBox: {
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: "#020617",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  caffeineLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  caffeineValue: {
    fontSize: 16,
    color: "#BFDBFE",
    fontWeight: "600",
  },

  addButton: {
    marginTop: 4,
    backgroundColor: "#2d3e82",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#4B5563",
  },
  addButtonText: {
    color: "#F9FAFB",
    fontSize: 15,
    fontWeight: "600",
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  list: {
    gap: 8,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#020617",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  recordLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  recordIcon: {
    fontSize: 18,
  },
  recordTitle: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "500",
  },
  recordMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  recordMetaText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  recordDot: {
    color: "#6B7280",
  },

  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#7F1D1D",
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#FEE2E2",
    fontWeight: "600",
  },

  totalBoxWrapper: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    paddingTop: 12,
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#2d3e82",
  },
  totalLabel: {
    color: "#F9FAFB",
    fontSize: 14,
  },
  totalValue: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "700",
  },

  noticeWrapper: {
    marginTop: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  noticeText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
});

export default styles;
