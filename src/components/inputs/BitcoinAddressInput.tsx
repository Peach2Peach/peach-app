import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { useQRScanner } from "../../hooks/useQRScanner";
import tw from "../../styles/tailwind";
import { parseBitcoinRequest } from "../../utils/bitcoin/parseBitcoinRequest";
import { cutOffAddress } from "../../utils/string/cutOffAddress";
import { ScanQR } from "../camera/ScanQR";
import { Input, InputProps } from "./Input";
import { useTranslate } from "@tolgee/react";

export const BitcoinAddressInput = ({
  value,
  onChangeText,
  ...props
}: InputProps & { value: string }) => {
  const [isFocused, setFocused] = useState(false);
  const { t } = useTranslate("form");
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
      placeholder={t("form.address.btc.placeholder")}
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
