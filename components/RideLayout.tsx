import icons from "@/constants/icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "./Map";

export default function RideLayout({
  children,
  title,
  snapPoints = ["40%", "85%"],
}: {
  children: React.ReactNode;
  title?: string;
  snapPoints?: (string | number)[] | SharedValue<(string | number)[]>;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 bg-white ">
        <View className="flex-col flex-1 bg-blue-500">
          <View className="flex-row absolute z-10 top-16 items-center justify-start px-5">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="h-10 w-10 bg-white rounded-full justify-center items-center">
                <Image
                  source={icons.backArrow}
                  className="h-6 w-6"
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-JakartaSemiBold ml-5">
              {title || "Go back"}
            </Text>
          </View>
          <Map />
        </View>
        <BottomSheet
          keyboardBehavior="extend"
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
        >
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
