import { InputProps } from "@/types/type";
import React, { useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Input({
  label,
  icon,
  secureTextEntry = false,
  labelStyle = "",
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  className = "",
  placholder,
  error,
  numberOfLines = 1,
  ...props
}: InputProps) {
  const [isFocus, setIsFocus] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.setNativeProps({
        selection: { start: 0, end: 0 },
      });
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          {label && (
            <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
              {label}
            </Text>
          )}
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border ${
              isFocus ? "border-primary-500" : "border-neutral-100"
            } ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
              ref={inputRef}
              className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              placeholder={placholder}
              onFocus={(e) => {
                props?.onFocus?.(e);
                setIsFocus(true);
              }}
              onBlur={(e) => {
                props?.onBlur?.(e);
                setIsFocus(false);
                handleBlur();
              }}
              numberOfLines={numberOfLines}
              {...props}
            />
          </View>
          {error && (
            <Text className="text-sm text-red-500 mt-1 ml-2">{error}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
