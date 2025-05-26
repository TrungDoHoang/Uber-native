import icons from "@/constants/icons";
import { fetchApi } from "@/utils/function";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import React, { useCallback } from "react";
import { Alert, Image, Text, View } from "react-native";
import Button from "./Button";

export default function OAuth() {
  const { startSSOFlow } = useSSO();

  const googleSignInHandler = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "uber",
            path: "/(root)/(tabs)/home",
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });

        if (signUp?.createdUserId) {
          await fetchApi("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName!} ${signUp.lastName!}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, []);
  return (
    <View>
      <View className="flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text>Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
        <View />
      </View>
      <Button
        title="Login with Google"
        className="w-full shadow-none mt-5"
        IconLeft={<Image source={icons.google} className="w-5 h-5 mx-2" />}
        bgVariant="Outline"
        textVariant="primary"
        onPress={googleSignInHandler}
      />
    </View>
  );
}
