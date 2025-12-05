import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0d1a",
  },
  loadingText: {
    color: "#b4bfd9",
    marginTop: 10,
  },

  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  star: {
    position: "absolute",
    backgroundColor: "#ffffffcc",
    borderRadius: 50,
  },

  header: {
    backgroundColor: "#3e4f93",
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerWelcome: {
    color: "white",
    fontSize: 18,
    opacity: 0.8,
  },
  headerName: {
    color: "white",
    fontSize: 26,
    fontWeight: "600",
  },

  headerIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "rgba(20, 27, 46, 0.9)",
    borderRadius: 30,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(45, 53, 97, 0.4)",
  },

  cardTitle: {
    fontSize: 22,
    color: "white",
    marginBottom: 20,
    fontWeight: "500",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  label: {
    color: "white",
    fontSize: 17,
  },

  value: {
    color: "#7ab8ff",
    fontSize: 17,
    fontWeight: "bold",
  },

  smallLabel: {
    color: "#b4bfd9",
    fontSize: 15,
  },

  smallValue: {
    color: "#7ab8ff",
    fontSize: 15,
    fontWeight: "500",
  },

  bottomSection: {
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 10,
  },

  bottomEmoji: {
    fontSize: 50,
  },

  bottomText: {
    color: "#7b8fc9",
    fontSize: 18,
    marginTop: 8,
  },
});
