import icons from "@/constants/icons";
import { Ride } from "@/types/type";
import { formatDate, formatTime } from "@/utils/function";
import React from "react";
import { Image, Text, View } from "react-native";

export default function RideCard({
  driver,
  destination_address,
  destination_longitude,
  destination_latitude,
  origin_address,
  created_at,
  ride_time,
  payment_status,
}: Ride) {
  return (
    <View className="flex-row  justify-center items-center bg-white rounded-lg shadow-md shadow-neutral-500 mb-3">
      <View className="items-center justify-center p-4">
        <View className="flex-row items-center justify-between">
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14.3497&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_KEY}`,
            }}
            className="w-[80px] h-[90px] rounded-lg"
          />
          <View className="mx-5 gap-y-5 flex-1">
            <View className="flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-sm font-JakartaMedium" numberOfLines={1}>
                {origin_address}
              </Text>
            </View>
            <View className="flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-sm font-JakartaMedium" numberOfLines={1}>
                {destination_address}
              </Text>
            </View>
          </View>
        </View>
        <View className="w-full mt-4 bg-general-500 rounded-lg p-4 items-start justify-center gap-y-4">
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-sm font-JakartaMedium text-general-200">
              Date & Time
            </Text>
            <Text className="text-sm font-JakartaMedium">
              {formatDate(created_at)}, {formatTime(ride_time)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-sm font-JakartaMedium text-general-200">
              Driver
            </Text>
            <Text className="text-sm font-JakartaMedium">
              {driver.first_name} {driver.last_name}
            </Text>
          </View>
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-sm font-JakartaMedium text-general-200">
              Car seats
            </Text>
            <Text className="text-sm font-JakartaMedium">
              {driver.car_seats}
            </Text>
          </View>
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-sm font-JakartaMedium text-general-200">
              Payment Status
            </Text>
            <Text
              className={`text-sm capitalize font-JakartaMedium ${
                payment_status === "paid" ? "text-green-500" : "text-red-500"
              }`}
            >
              {payment_status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
