import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useQRScanner } from "../../hooks/useQRScanner";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { parseLiquidRequest } from "../../utils/liquid/parseLiquidRequest";
import { cutOffAddress } from "../../utils/string/cutOffAddress";
import { ScanQR } from "../camera/ScanQR";
import { Input, InputProps } from "./Input";

export const LiquidAddressInput = ({
  value,
  onChangeText,
  ...props
}: InputProps & { value: string }) => {
  const [isFocused, setFocused] = useState(false);
  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString();
    const request = parseLiquidRequest(clipboard);
    if (onChangeText) onChangeText(request.address || clipboard);
  };
  const onSuccess = (data: string) => {
    const request = parseLiquidRequest(data);
    if (onChangeText) onChangeText(request.address || data);
  };
  const { showQRScanner, showQR, closeQR, onRead } = useQRScanner({
    onSuccess,
  });

  return !showQRScanner ? (
    <Input
      placeholder={i18n("form.address.liquid.placeholder")}
      placeholderTextColor={tw.color("black-10")}
      icons={[
        ["clipboard", pasteAddress],
        ["camera", showQR],
      ]}
      onChangeText={onChangeText}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      value={isFocused ? value : cutOffAddress(value)}
      {...props}
    />
  ) : (
    <ScanQR onRead={onRead} onCancel={closeQR} />
  );
};
