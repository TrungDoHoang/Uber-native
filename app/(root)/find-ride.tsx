import Button from "@/components/Button";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import icons from "@/constants/icons";
import { useDriverStore, useLocationStore } from "@/store";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function FindRide() {
  const {
    userAddress,
    destinationAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();
  const { clearSelectedDriver } = useDriverStore();
  // const router = useRouter()

  useEffect(() => {
    clearSelectedDriver();
  }, []);
  return (
    <RideLayout title="Ride">
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold">From</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          handlePress={(location) => setUserLocation(location)}
        />
      </View>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold">To</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <Button
        title="Find Now"
        onPress={() => router.push("/(root)/confirm-ride")}
      />
    </RideLayout>
  );
}
