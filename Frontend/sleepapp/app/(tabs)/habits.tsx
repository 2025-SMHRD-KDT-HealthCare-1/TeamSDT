import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "../../styles/habitsstyles";

import CaffeineTracking from "../../components/caffeinetracking";
import ScreenTimeTracking from "../../components/screentimetracking";

export default function Habits() {
  const [activeTab, setActiveTab] = useState<"caffeine" | "screentime">(
    "caffeine"
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>생활습관 기록</Text>
      </View>

      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "caffeine" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("caffeine")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "caffeine" && styles.tabActiveText,
              ]}
            >
              ☕ 카페인
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "screentime" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("screentime")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "screentime" && styles.tabActiveText,
              ]}
            >
              📱 스크린타임
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {activeTab === "caffeine" ? (
          <CaffeineTracking />
        ) : (
          <ScreenTimeTracking />
        )}
      </ScrollView>
    </View>
  );
}
