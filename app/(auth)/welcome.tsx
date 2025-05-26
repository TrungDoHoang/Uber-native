import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { onboarding } from "@/constants";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function Onboarding() {
  const router = useRouter();
  const swiperRef = useRef<Swiper>(null);
  const [indexActive, setIndexActive] = useState(0);
  const isLastIndex = indexActive === onboarding.length - 1;
  const [alreadyLaunched, setAlreadyLaunched] = useState<boolean | null>(true);

  const skipHandler = async () => {
    await SecureStore.setItemAsync("alreadyLaunched", "true");
    router.replace("/(auth)/onboard");
  };
  const nextHandler = () => {
    if (isLastIndex) {
      skipHandler();
    } else {
      swiperRef.current?.scrollBy(1);
    }
  };
  useEffect(() => {
    const setupLauch = async () => {
      const isFirstLaunch = await SecureStore.getItemAsync("alreadyLaunched");
      setAlreadyLaunched(!!isFirstLaunch);
      if (isFirstLaunch !== null) {
        skipHandler();
      }
    };
    setupLauch();
  }, []);

  if (alreadyLaunched) {
    return <Loading visible />; // Loading
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-between p-4 bg-white">
      <TouchableOpacity
        onPress={skipHandler}
        className="w-full flex items-end justify-end p-6"
      >
        <Text className="text-black text-lg font-JakartaBold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#e2e8f0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-primary-500 rounded-full" />
        }
        onIndexChanged={(idx) => setIndexActive(idx)}
        index={indexActive}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="justify-center items-center p-2">
            <Image
              source={item.image}
              className="w-full h-[300px] mt-10"
              resizeMode="contain"
            />
            <View className="w-full justify-center items-center mt-[50px]">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
              <Text className="text-general-200 font-JakartaSemiBold text-center text-lg mx-10 mt-3">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>
      <Button
        onPress={nextHandler}
        title={isLastIndex ? "Get Started" : "Next"}
        bgVariant="Primary"
        className="w-11/12 mt-10 mb-8"
      />
    </SafeAreaView>
  );
}
