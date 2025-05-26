import images from "@/constants/images";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  return (
    <ScrollView contentContainerClassName="flex-1">
      <SafeAreaView className="px-5 bg-general-500 pb-[110px] flex-1">
        <View className="mt-5 flex-row justify-between items-center">
          <Text className="text-2xl font-JakartaBold capitalize">
            Chat List
          </Text>
        </View>
        <View className="flex-1 justify-center">
          <View className="justify-center items-center">
            <Image
              source={images.message}
              className="h-[115px]"
              resizeMode="contain"
            />
            <Text className="text-3xl font-JakartaBold mt-14 mb-2">
              No Messages, yet.
            </Text>
            <Text className="font-JakartaMedium text-lg text-general-200">
              No messages in your inbox, yet!
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
