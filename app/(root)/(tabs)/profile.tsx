import Button from "@/components/Button";
import Input from "@/components/Input";
import icons from "@/constants/icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const userUpdate = async () => {
    try {
      user?.update({});
    } catch (error) {}
  };
  return (
    <ScrollView className="flex-1">
      <SafeAreaView className="px-5 bg-general-500 pb-[110px]">
        <View className="mt-5 flex-row justify-between items-center">
          <Text className="text-2xl font-JakartaBold capitalize">
            Your Profile
          </Text>
        </View>
        <View className="flex items-center mt-6 mb-8">
          <View
            className={`w-[114px] h-[114px] rounded-full bg-white justify-center items-center ${
              Platform.OS === "ios" ? "shadow-lg" : "elevation-lg"
            } shadow-neutral-300`}
          >
            <Image
              source={{ uri: user?.imageUrl }}
              resizeMode="contain"
              className="w-[110px] h-[110px] rounded-full"
            />
          </View>
        </View>
        <View className="h-[500px] bg-white rounded-2xl px-3 py-6 ">
          <Input
            editable={false}
            label="First Name"
            labelStyle="font-JakartaMedium text-sm text-general-200"
            placeholder={user?.firstName || ""}
          />
          <Input
            editable={false}
            label="Last Name"
            labelStyle="font-JakartaMedium text-sm text-general-200"
            placeholder={user?.lastName || ""}
          />
          <Input
            editable={false}
            label="Email"
            labelStyle="font-JakartaMedium text-sm text-general-200"
            placeholder={user?.primaryEmailAddress?.emailAddress || ""}
          />

          <View className="my-2">
            <Text className="font-JakartaMedium text-sm text-general-200 mb-3">
              Email status
            </Text>
            <View className="bg-neutral-100 p-4 rounded-full items-start">
              <View className="flex-row bg-[#E7F9EF] border border-[#0CC25F] px-4 py-1 rounded-full justify-center items-center gap-1">
                <Image source={icons.charmTick} className="w-4 h-4" />
                <Text className="text-sm">Verified</Text>
              </View>
            </View>
          </View>

          <Input
            editable={false}
            label="Phone"
            labelStyle="font-JakartaMedium text-sm text-general-200"
            placeholder={user?.primaryPhoneNumber?.phoneNumber || ""}
          />
        </View>
        <Button title="Save" className="mt-5" disabled />
      </SafeAreaView>
    </ScrollView>
  );
}
