import Button from "@/components/Button";
import { NavLink } from "@/components/NavLink";
import OAuth from "@/components/OAuth";
import images from "@/constants/images";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function Onboard() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View>
        <View className=" w-full mb-9">
          <Image
            source={images.getStarted}
            className="w-full h-[400px] z-0"
            resizeMode="cover"
          />
        </View>
        <View className="px-5">
          <Text className="text-black text-3xl font-bold mx-10 text-center">
            Let’s get started
          </Text>
          <Text className="text-general-200 font-JakartaMedium text-center text-lg mx-10 mt-3 tracking-wide">
            Sign up or log in to find out the best car for you
          </Text>
        </View>
        <View className="px-5">
          <Button
            title="Sign Up"
            className="mt-9"
            onPress={() => router.push("/(auth)/sign-up")}
          />

          {/* OAuth */}
          <OAuth />

          <NavLink
            href={"/(auth)/sign-in"}
            className="text-lg font-Jakarta mt-10 text-center"
          >
            <Text className="text-general-200">Already have an account? </Text>
            <Text className="text-primary-500 font-bold">Sign In</Text>
          </NavLink>

          {/* Verification modal */}
        </View>
      </View>
    </ScrollView>
  );
}
