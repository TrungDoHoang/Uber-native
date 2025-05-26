import { ButtonProps } from "@/types/type";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function Button({
  onPress,
  title,
  bgVariant = "Primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className = "",
  ...props
}: ButtonProps) {
  const getBgVariant = (variant: ButtonProps["bgVariant"]) => {
    switch (variant) {
      case "Secondary":
        return "bg-gray-500";
      case "Danger":
        return "bg-red-500";
      case "Success":
        return "bg-green-500";
      case "Outline":
        return "bg-transparent border-neutral-300 border-[0.5px]";
      default:
        return "bg-primary-500";
    }
  };
  const getTextVariant = (variant: ButtonProps["textVariant"]) => {
    switch (variant) {
      case "primary":
        return "text-black";
      case "secondary":
        return "text-gray-100";
      case "danger":
        return "text-red-100";
      case "success":
        return "text-green-100";
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full flex flex-row rounded-full justify-center items-center shadow-md shadow-neutral-400/70 py-4 px-5 ${getBgVariant(
        bgVariant
      )} ${className} ${props.disabled ? "opacity-60" : ""}`}
      {...props}
    >
      {IconLeft}
      <Text
        className={`${getTextVariant(textVariant)} font-JakartaBold text-lg`}
      >
        {title}
      </Text>
      {IconRight}
    </TouchableOpacity>
  );
}
