import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

export default function TabIcon({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) {
  return (
    <View
      className={`rounded-full w-14 h-14 justify-center items-center ${
        focused ? "bg-general-400" : ""
      }`}
    >
      <Image
        source={source}
        tintColor={"white"}
        resizeMode="contain"
        className="h-7 w-7"
      />
    </View>
  );
}
