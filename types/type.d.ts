import { ClerkAPIError } from "@clerk/types";
import { TextInputProps, TouchableOpacityProps } from "react-native";

export type ButtonProps = TouchableOpacityProps & {
  bgVariant?: "Primary" | "Secondary" | "Danger" | "Success" | "Outline";
  textVariant?: "primary" | "secondary" | "danger" | "success" | "default";
  IconLeft?: React.ReactNode;
  IconRight?: React.ReactNode;
  title: string;
};

export type InputProps = TextInputProps & {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  placholder?: string;
  error?: string;
};

export type GoogleInputProps = {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
};

export type Verification = {
  code: string;
  state: "default" | "pending" | "success" | "failed";
  error: string;
  errors: ClerkAPIError[];
};

export interface Ride {
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number;
  fare_price: number;
  payment_status: string;
  driver_id: number;
  user_email: string;
  created_at: string;
  driver: {
    first_name: string;
    last_name: string;
    car_seats: number;
  };
}

export interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  clearDestinationLocation: () => void;
}

export interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}

export interface DriverCardProps {
  item: MarkerData;
  selected: number;
  setSelected: (number) => void;
}

declare interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
}

export interface MarkerData {
  latitude: number;
  longitude: number;
  id?: number;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
  first_name: string;
  last_name: string;
  time?: number;
  price?: number;
}

export interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string; // Vĩ độ (latitude)
  lon: string; // Kinh độ (longitude)
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address: Record<string, string>;
}

export interface PaymentProps {
  fullName: string;
  email: string;
  amount: number;
  driverId: number;
  rideTime: number;
}
