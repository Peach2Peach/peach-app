import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useQRScanner } from "../../hooks/useQRScanner";
import { useThemeStore } from "../../store/theme";
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
  const { isDarkMode } = useThemeStore();

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

  return (
    <>
      <Input
        placeholder={i18n("form.address.btc.placeholder")}
        placeholderTextColor={tw.color(
          isDarkMode ? "backgroundLight-light" : "black-10",
        )}
        icons={[
          ["clipboard", pasteAddress],
          ["camera", showQR],
        ]}
        iconColor={tw.color("primary-main")}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={isFocused ? value : cutOffAddress(value)}
        style={[
          tw`px-4 py-2 border-2 rounded-lg`,
          isDarkMode
            ? tw`bg-transparent border-2 border-black-50 text-backgroundLight-light`
            : tw`bg-white text-black-100`,
        ]}
        {...props}
      />

      {showQRScanner && <ScanQR onRead={onRead} onCancel={closeQR} />}
    </>
  );
};
