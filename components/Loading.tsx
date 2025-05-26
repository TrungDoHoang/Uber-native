import React from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  Platform,
  StatusBar,
  View,
} from "react-native";

interface LoadingProps extends ActivityIndicatorProps {
  visible: boolean;
  containerStyles?: string;
}

export default function Loading(props: LoadingProps) {
  if (!props.visible) {
    return null;
  }
  return (
    <View
      className={`absolute inset-0 bg-black/60 justify-center items-center z-50 ${
        props.containerStyles || ""
      }`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: Platform.OS === "android" ? -(StatusBar.currentHeight ?? 0) : 0,
        elevation: 999, // for Android
        zIndex: 999, // for iOS
      }}
    >
      <ActivityIndicator size="large" color="#0286FF" {...props} />
    </View>
  );
}
