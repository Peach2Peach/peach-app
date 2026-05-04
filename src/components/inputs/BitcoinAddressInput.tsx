import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useQRScanner } from "../../hooks/useQRScanner";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { parseBitcoinRequest } from "../../utils/bitcoin/parseBitcoinRequest";
import i18n, { useI18n } from "../../utils/i18n";
import { cutOffAddress } from "../../utils/string/cutOffAddress";
import { ScanQR } from "../camera/ScanQR";
import { Input, InputProps } from "./Input";

export const BitcoinAddressInput = ({
  value,
  onChangeText,
  onAmountScanned,
  ...props
}: InputProps & {
  value: string;
  onAmountScanned?: (amountInSats: number) => void;
}) => {
  useI18n();
  const [isFocused, setFocused] = useState(false);
  const { isDarkMode } = useThemeStore();

  const handleParsedRequest = (raw: string) => {
    const request = parseBitcoinRequest(raw);
    if (onChangeText) onChangeText(request.address || raw);
    if (
      onAmountScanned &&
      request.amount !== undefined &&
      Number.isFinite(request.amount)
    )
      onAmountScanned(Math.round(request.amount * 1e8));
  };

  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString();
    handleParsedRequest(clipboard);
  };
  const onSuccess = (data: string) => {
    handleParsedRequest(data);
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
