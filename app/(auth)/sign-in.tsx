import Button from "@/components/Button";
import Input from "@/components/Input";
import { NavLink } from "@/components/NavLink";
import OAuth from "@/components/OAuth";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getErrMgs } from "@/utils/function";
import { useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function SignIn() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);
  const router = useRouter();

  const signInHandler = async () => {
    setErrors([]);
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        // TODO: create database user
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setErrors(err.errors);
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View>
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="w-full h-[250px] z-0" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-8 left-6">
            Welcome 👋👋
          </Text>
        </View>
        <View className="p-5">
          <Input
            label="Email"
            placholder="Enter your email"
            icon={icons.email}
            value={form.email}
            error={getErrMgs({
              err: errors,
              field: "identifier",
            })}
            onChangeText={(val) => setForm((prev) => ({ ...prev, email: val }))}
          />
          <Input
            label="Password"
            placholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry
            error={getErrMgs({
              err: errors,
              field: "password",
              replaceField: "Password",
            })}
            onChangeText={(val) =>
              setForm((prev) => ({ ...prev, password: val }))
            }
          />

          <Button title="Sign In" className="mt-10" onPress={signInHandler} />

          {/* OAuth */}
          <OAuth />

          <NavLink
            href={"/(auth)/sign-up"}
            className="text-lg font-Jakarta mt-10 text-center"
          >
            <Text className="text-general-200">Don’t have an account? </Text>
            <Text className="text-primary-500 font-bold">Sign Up</Text>
          </NavLink>

          {/* Verification modal */}
        </View>
      </View>
    </ScrollView>
  );
}
