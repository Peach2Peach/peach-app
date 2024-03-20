import Clipboard from "@react-native-clipboard/clipboard";
import { useQRScanner } from "../../hooks/useQRScanner";
import { ScanQR } from "../camera/ScanQR";
import { Input, InputProps } from "./Input";
import { useTranslate } from "@tolgee/react";

export const URLInput = (props: InputProps) => {
  const { t } = useTranslate("wallet");
  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString();
    if (props.onChangeText) props.onChangeText(clipboard);
  };
  const onSuccess = (address: string) => {
    if (props.onChangeText) props.onChangeText(address);
  };
  const { showQRScanner, showQR, closeQR, onRead } = useQRScanner({
    onSuccess,
  });

  return !showQRScanner ? (
    <Input
      label={t("wallet.settings.node.address")}
      placeholder={t("wallet.settings.node.address.placeholder")}
      {...props}
      icons={
        props.icons ?? [
          ["clipboard", pasteAddress],
          ["camera", showQR],
        ]
      }
    />
  ) : (
    <ScanQR onRead={onRead} onCancel={closeQR} />
  );
};
