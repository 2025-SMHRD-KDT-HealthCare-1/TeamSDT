import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import StarsBackground from "../../components/starsbackground";

export default function MeasureScreen() {
  return (
    <View style={styles.container}>
      <StarsBackground />
      <Text style={styles.title}>수면 측정</Text>
      <Text style={styles.desc}>측정을 시작하면 AI가 수면을 분석해요.</Text>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>측정 시작</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0d1a",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "white", fontSize: 28, fontWeight: "600" },
  desc: { color: "#b4bfd9", marginTop: 10, marginBottom: 30 },
  btn: {
    backgroundColor: "#5b6fb9",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 20,
  },
  btnText: { color: "#fff", fontSize: 18 },
});
