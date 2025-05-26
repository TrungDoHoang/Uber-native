import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { LatLng, Polyline } from "react-native-maps";

interface RouteResponse {
  routes: {
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
  }[];
  code?: string;
}

const OSRMDirections: React.FC<{
  origin: LatLng;
  destination: LatLng;
  strokeColor?: string;
  strokeWidth?: number;
}> = ({ origin, destination, strokeColor = "#000", strokeWidth = 3 }) => {
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/` +
            `${origin.longitude},${origin.latitude};` +
            `${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
        );

        const data: RouteResponse = await response.json();

        if (data.code !== "Ok" || !data.routes?.length) {
          throw new Error("No route found");
        }

        setCoordinates(
          data.routes[0].geometry.coordinates.map((coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination]);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <View>{error}</View>;

  return (
    <Polyline
      key={`route-${Date.now()}`}
      coordinates={coordinates}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
    />
  );
};

export default OSRMDirections;
