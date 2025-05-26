import GoogleTextInput from "@/components/GoogleTextInput";
import Loading from "@/components/Loading";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useDriverStore, useLocationStore } from "@/store";
import { Ride } from "@/types/type";
import { useFetch } from "@/utils/hook";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [hasPermission, setHasPermission] = useState(false);
  const { data: rides, loading } = useFetch<Ride[]>(
    `/(api)/(ride)/${user?.id}`
  );

  // Store
  const { setUserLocation, setDestinationLocation, clearDestinationLocation } =
    useLocationStore();
  const { clearSelectedDriver } = useDriverStore();

  const handlerSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handlerDestinationPress = async (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== Location.PermissionStatus.GRANTED) {
          setHasPermission(false);
          return;
        }
        setHasPermission(true);

        const location = await Location.getCurrentPositionAsync();
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address[0].formattedAddress!,
        });
      } catch (error) {
        console.error(error);
      }
    };
    requestLocation();
  }, []);

  useEffect(() => {
    if (isFocused) {
      clearDestinationLocation();
      clearSelectedDriver();
    }
  }, [isFocused]);

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      <FlatList
        data={rides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard {...item} />}
        className="px-5"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="justify-center items-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found!</Text>
              </>
            ) : (
              <Loading visible containerStyles="bg-transparent mt-20" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="my-5 flex-row justify-between items-center">
              <Text className="text-xl font-JakartaBold capitalize">
                Welcome{" "}
                {user?.firstName ||
                  user?.primaryEmailAddress?.emailAddress.split("@")[0]}
                👋
              </Text>
              <TouchableOpacity
                className="h-10 w-10 bg-white justify-center items-center rounded-full"
                onPress={handlerSignOut}
              >
                <Image source={icons.out} className="h-5 w-5" />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle={`bg-white ${
                Platform.OS === "ios" ? "shadow-lg" : "elevation-lg"
              } shadow-neutral-300`}
              handlePress={handlerDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3 capitalize">
                Your current location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>
            <Text className="text-xl font-JakartaBold mt-7 mb-5">
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}
