import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useQRScanner } from "../../hooks/useQRScanner";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
import tw from "../../styles/tailwind";
import { parseBitcoinRequest } from "../../utils/bitcoin/parseBitcoinRequest";
import i18n from "../../utils/i18n";
import { cutOffAddress } from "../../utils/string/cutOffAddress";
import { ScanQR } from "../camera/ScanQR";
import { Input, InputProps } from "./Input";

export const BitcoinAddressInput = ({
  value,
  onChangeText,
  ...props
}: InputProps & { value: string }) => {
  const [isFocused, setFocused] = useState(false);
  const { isDarkMode } = useThemeStore(); // Access dark mode state

  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString();
    const request = parseBitcoinRequest(clipboard);
    if (onChangeText) onChangeText(request.address || clipboard);
  };
  const onSuccess = (data: string) => {
    const request = parseBitcoinRequest(data);
    if (onChangeText) onChangeText(request.address || data);
  };
  const { showQRScanner, showQR, closeQR, onRead } = useQRScanner({
    onSuccess,
  });

  return !showQRScanner ? (
    <Input
      placeholder={i18n("form.address.btc.placeholder")}
      placeholderTextColor={tw.color(isDarkMode ? "backgroundLight-light" : "black-10")} // Adjust placeholder color
      icons={[
        ["clipboard", pasteAddress],
        ["camera", showQR],
      ]}
      iconColor={tw.color("primary-main")} // Set icon color directly
      onChangeText={onChangeText}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      value={isFocused ? value : cutOffAddress(value)}
      style={[
        tw`border-2 rounded-lg px-4 py-2`, // Add any additional styles you want
        isDarkMode ? tw`border-2 border-black-50 bg-transparent text-backgroundLight-light` : tw`bg-white text-black-100`, // Conditionally apply styles
      ]}
      {...props}
    />
  ) : (
    <ScanQR onRead={onRead} onCancel={closeQR} />
  );
};
