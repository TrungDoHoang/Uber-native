import Loading from "@/components/Loading";
import RideCard from "@/components/RideCard";
import images from "@/constants/images";
import { Ride } from "@/types/type";
import { fetchApi } from "@/utils/function";
import { useAuth } from "@clerk/clerk-expo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Rides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const lastTapRef = useRef(0);
  const scrollViewRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  const fetchData = () => {
    setLoading(true);
    fetchApi(`/(api)/(ride)/${userId}`)
      .then((res) => setRides(res.data))
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("tabPress" as any, (e) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        // Kiểm tra double click
        if (
          lastTapRef.current &&
          now - lastTapRef.current < DOUBLE_PRESS_DELAY
        ) {
          // Cuộn lên đầu trang
          scrollViewRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
          });
          // Reload data
          fetchData();
        }

        lastTapRef.current = now;
      });

      return unsubscribe;
    }, [navigation])
  );

  return (
    <SafeAreaView className="flex-1">
      <Loading visible={loading} />
      <FlatList
        data={rides}
        renderItem={({ item }) => <RideCard {...item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
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
          <View className="my-5 flex-row justify-between items-center">
            <Text className="text-2xl font-JakartaBold capitalize">
              All Rides
            </Text>
          </View>
        )}
        onRefresh={fetchData}
        refreshing={false}
      />
    </SafeAreaView>
  );
}
