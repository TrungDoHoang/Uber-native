import icons from "@/constants/icons";
import { GoogleInputProps, NominatimResult } from "@/types/type";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Input from "./Input";

export default function GoogleTextInput({
  icon,
  initialLocation = "",
  containerStyle = "",
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) {
  const [query, setQuery] = useState(initialLocation);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const debounceTimer = useRef<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Hàm gọi API sau khi debounce
  const fetchPlaces = async (searchText: string) => {
    if (searchText.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${searchText}&format=json&addressdetails=1&countrycodes=vn&limit=5`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }
  };

  // Xử lý khi chọn địa điểm
  const handleSelectPlace = (item: NominatimResult) => {
    setQuery(item.display_name);
    setShowResults(false);
    handlePress({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    });
    setResults([]); // Ẩn danh sách sau khi chọn
  };

  // Xử lý debounce khi người dùng nhập
  const handleSearch = (text: string) => {
    setQuery(text);

    // Clear timer cũ nếu có
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Đặt timer mới (1000ms)
    debounceTimer.current = setTimeout(() => {
      fetchPlaces(text);
    }, 1000);
  };

  // Cleanup timer khi component unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <View className="relative px-4 pt-2">
      <Input
        icon={icon || icons.search}
        placeholder="Where want you go?"
        value={query}
        onChangeText={handleSearch}
        containerStyle="border-none bg-white relative w-full"
        onFocus={() => setShowResults(true)}
      />
      {showResults && results.length > 0 && (
        <View className="absolute top-[100%] left-4 right-4 bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 max-h-60 overflow-hidden">
          <FlatList
            data={results}
            keyboardShouldPersistTaps="always"
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <Pressable
                className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                onPress={() => handleSelectPlace(item)}
                delayLongPress={1000}
              >
                <Text className="font-medium text-gray-800" numberOfLines={1}>
                  {item.display_name}
                </Text>
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  {[item.address?.city, item.address?.country]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </Pressable>
            )}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1, // Đảm bảo nội dung có thể mở rộng
              paddingBottom: 16, // Thêm khoảng trống cuối danh sách
            }}
            nestedScrollEnabled={true} // Quan trọng với scroll view lồng nhau
            scrollEnabled={results.length > 3} // Chỉ scroll khi có đủ item
            onContentSizeChange={(w, h) => console.log("Content height:", h)} // Debug chiều cao
          />
        </View>
      )}
    </View>
  );
}
