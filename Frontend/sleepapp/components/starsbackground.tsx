import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  style?: ViewStyle;
}

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
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
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
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    zIndex: -1,
  },
  star: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 50,
  },
});
