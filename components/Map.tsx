import icons from "@/constants/icons";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { useFetch } from "@/utils/hook";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/utils/map";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

export default function Map() {
  // State
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const {
    data: drivers,
    loading,
    errors,
  } = useFetch<Driver[]>("/(api)/driver");

  // Store
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();

  // Var
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    if (userLatitude && userLongitude && Array.isArray(drivers)) {
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drvs) => {
        setDrivers(drvs as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"small"} color={"#000"} />
      </View>
    );
  }
  if (errors) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {errors}</Text>
      </View>
    );
  }

  return (
    <MapView
      style={{ width: "100%", height: "100%" }}
      provider={PROVIDER_GOOGLE}
      tintColor="black"
      mapType="standard"
      showsPointsOfInterest
      showsUserLocation={true}
      userInterfaceStyle="light"
      initialRegion={region}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
        >
          <Image
            source={
              selectedDriver === marker.id ? icons.selectedMarker : icons.marker
            }
            className="w-10 h-10"
          />
        </Marker>
      ))}

      {!!(
        destinationLatitude &&
        destinationLongitude &&
        userLatitude &&
        userLongitude
      ) && (
        <>
          <Marker
            key={"destinationLocation"}
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title={destinationAddress!}
            style={{ width: 100, height: 100 }}
          >
            <Image
              source={icons.pin}
              className="w-7 h-7"
              resizeMode="contain"
            />
          </Marker>
          <MapViewDirections
            origin={{ latitude: userLatitude, longitude: userLongitude }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor="#0286ff"
            strokeWidth={3}
          />
        </>
      )}
    </MapView>
  );
}
