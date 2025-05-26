import images from "@/constants/images";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";
import { fetchApi } from "@/utils/function";
import { useAuth } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import Button from "./Button";

export default function Payment({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false);
  const { userId } = useAuth();
  const {
    userAddress,
    userLatitude,
    userLongitude,
    destinationAddress,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Uber Inc.",

      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: fullName,
      },
      intentConfiguration: {
        mode: {
          amount: amount * 100,
          currencyCode: "USD",
        },
        confirmHandler: async (paymentMethod, _, intentCreationCallback) => {
          try {
            // Make a request to your own server, passing paymentMethod.id and shouldSavePaymentMethod.
            const response = await fetchApi("/(api)/(stripe)/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: fullName,
                email: email,
                amount,
                paymentMethodId: paymentMethod.id,
              }),
            });
            // Call the `intentCreationCallback` with your server response's client secret or error
            const { paymentIntent, ephemeralKey, customer } = await response;

            if (paymentIntent.client_secret) {
              const { result } = await fetchApi("/(api)/(stripe)/pay", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payment_method_id: paymentMethod.id,
                  payment_intent_id: paymentIntent.id,
                  customer_id: customer,
                }),
              });

              if (result.client_secret) {
                await fetchApi("/(api)/(ride)/create", {
                  method: "POST",
                  body: JSON.stringify({
                    origin_address: userAddress,
                    destination_address: destinationAddress,
                    origin_latitude: userLatitude,
                    origin_longitude: userLongitude,
                    destination_latitude: destinationLatitude,
                    destination_longitude: destinationLongitude,
                    ride_time: rideTime,
                    fare_price: parseInt(amount.toString()) * 100,
                    payment_status: "paid",
                    driver_id: driverId,
                    user_id: userId,
                  }),
                });
                intentCreationCallback({ clientSecret: result.client_secret });
              }
            }
          } catch (error) {
            console.log("confirmHandler err: ", error);
          }
        },
      },
      returnURL: 'uber"//book-ride',
    });
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  const backHome = async () => {
    await setSuccess(false);
    router.replace("/(root)/(tabs)/home");
  };

  return (
    <>
      <Button
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
      <ReactNativeModal isVisible={success} onBackdropPress={backHome}>
        <View className="bg-white flex-col, justify-center items-center p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />
          <Text className="text-2xl font-JakartaBold mt-5 text-center">
            Ride Booked!
          </Text>
          <Text className="text-lg text-general-200 font-JakartaMedium mt-3 text-center">
            Thank you for your booking. Your reservation has been placed. Please
            proceed width your trips!
          </Text>
          <Button title="Back Home" onPress={backHome} className="mt-5" />
        </View>
      </ReactNativeModal>
    </>
  );
}
