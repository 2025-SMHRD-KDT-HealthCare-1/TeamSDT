import { View, Text, TouchableOpacity } from "react-native";
import StarsBackground from "../../components/starsbackground";
import { router } from "expo-router";
import styles from "../../styles/introstyles";

export default function index() {
  return (
    <View style={styles.container}>
      <StarsBackground />

      <TouchableOpacity
        style={styles.skip}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text style={styles.skipText}>건너뛰기</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>🦥</Text>
      <Text style={styles.title}>좋은 잠에 오신 것을 환영합니다</Text>
      <Text style={styles.desc}>
        AI 기반 수면 분석으로{"\n"}더 나은 잠을 경험하세요
      </Text>

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("/intro/step2")}
      >
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}
