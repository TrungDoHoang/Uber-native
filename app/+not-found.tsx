import { NavLink } from "@/components/NavLink";
import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-[20px]">
        <Text>This screen does not exist.</Text>
        <NavLink href="/" className="mt-[15px] py-[15px]">
          <Text>Go to home screen!</Text>
        </NavLink>
      </View>
    </>
  );
}
