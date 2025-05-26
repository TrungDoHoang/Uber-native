import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { NavLink } from "@/components/NavLink";
import OAuth from "@/components/OAuth";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Verification } from "@/types/type";
import { fetchApi, getErrMgs } from "@/utils/function";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [verification, setVerification] = React.useState<Verification>({
    code: "",
    state: "default",
    error: "",
    errors: [],
  });

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    setVerification((prev) => ({ ...prev, errors: [] }));
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    const arrName = form.name.split(" ");
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: arrName[0],
        lastName: arrName.slice(0, 1).join(" "),
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification((prev) => ({ ...prev, state: "pending" }));
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification((prev) => ({ ...prev, errors: err.errors }));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    setVerification((prev) => ({ ...prev, error: "" }));
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await fetchApi("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });

        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification((prev) => ({ ...prev, state: "success" }));
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerification((prev) => ({
          ...prev,
          state: "pending",
          error: "Verification failed!",
        }));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification((prev) => ({
        ...prev,
        state: "pending",
        error: err.errors[0].longMessage,
      }));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Loading visible={false} size={"large"} className="color-primary-500" />
      <View>
        <View className="relative w-full h-[250px]">
          <Image
            source={images.signUpCar}
            height={250}
            className="w-full h-[250px] z-0"
          />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-8 left-6">
            Create Your Account!
          </Text>
        </View>
        <View className="p-5">
          <Input
            label="Name"
            placholder="Enter your name"
            icon={icons.person}
            value={form.name}
            error={getErrMgs({
              err: verification.errors,
              field: "name",
              replaceField: "Name",
            })}
            onChangeText={(val) => setForm((prev) => ({ ...prev, name: val }))}
          />
          <Input
            label="Email"
            placholder="Enter your email"
            icon={icons.email}
            value={form.email}
            textContentType="emailAddress"
            error={getErrMgs({
              err: verification.errors,
              field: "email_address",
              replaceField: "Email",
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
              err: verification.errors,
              field: "password",
              replaceField: "Password",
            })}
            onChangeText={(val) =>
              setForm((prev) => ({ ...prev, password: val }))
            }
          />

          <Button title="Sign Up" className="mt-10" onPress={onSignUpPress} />

          {/* OAuth */}
          <OAuth />

          <NavLink
            href={"/(auth)/sign-in"}
            className="text-lg font-Jakarta mt-10 text-center"
          >
            <Text className="text-general-200">Already have an account? </Text>
            <Text className="text-primary-500 font-bold">Log In</Text>
          </NavLink>

          {/* Verification modal */}
          <ReactNativeModal isVisible={verification.state === "pending"}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] ">
              <Text className="font-JakartaBold text-2xl mb-2">
                Verification
              </Text>
              <Text className="text-base text-general-200 mb-10">
                We've sent a verification code to {form.email}
              </Text>
              <Input
                icon={icons.lock}
                value={verification.code}
                className="w-full"
                placeholder="Enter your verification code"
                keyboardType="numeric"
                error={verification.error}
                onChangeText={(code) =>
                  setVerification((prev) => ({ ...prev, code }))
                }
              />
              <Button
                title="Verify Email"
                onPress={onVerifyPress}
                className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>

          <ReactNativeModal
            isVisible={verification.state === "success"}
            animationIn={"bounce"}
          >
            <View className="bg-white px-4 py-10 rounded-2xl min-h-[300px] items-center">
              <Image
                source={images.check}
                className="h-[110px] w-[110px] mx-auto my-5"
              />
              <Text className="font-JakartaBold text-2xl mt-10">Verified!</Text>
              <Text className="text-base text-general-200 mt-2">
                You have successfully verified your account.
              </Text>
              <Button
                title="Browse Home"
                className="mt-10"
                onPress={() => router.replace("/(root)/(tabs)/home")}
              />
            </View>
          </ReactNativeModal>
        </View>
      </View>
    </ScrollView>
  );
}
