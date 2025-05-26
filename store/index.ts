import { DriverStore, LocationStore } from "@/types/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => ({
  destinationAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  userAddress: null,
  userLatitude: null,
  userLongitude: null,
  setUserLocation({ latitude, longitude, address }) {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
  },
  setDestinationLocation({ latitude, longitude, address }) {
    set(() => ({
      destinationAddress: address,
      destinationLatitude: latitude,
      destinationLongitude: longitude,
    }));
  },
  clearDestinationLocation() {
    set(() => ({
      destinationAddress: null,
      destinationLatitude: null,
      destinationLongitude: null,
    }));
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [],
  selectedDriver: null,

  clearSelectedDriver() {
    set(() => ({
      selectedDriver: null,
    }));
  },
  setDrivers(drivers) {
    set(() => ({ drivers }));
  },
  setSelectedDriver(driverId) {
    set(() => ({ selectedDriver: driverId }));
  },
}));
