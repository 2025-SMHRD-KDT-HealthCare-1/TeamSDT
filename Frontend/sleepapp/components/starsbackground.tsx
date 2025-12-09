import React from "react";
import { View, StyleSheet, ViewStyle, Dimensions } from "react-native";

interface Props {
  style?: ViewStyle;
}

const { width, height } = Dimensions.get("window");

export default function StarsBackground({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: 80 }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        return (
          <View
            key={i}
            style={[
              styles.star,
              {
                width: size,
                height: size,
                top: Math.random() * height,
                left: Math.random() * width,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
  },

  star: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 50,
  },
});
