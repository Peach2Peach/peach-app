import Clipboard from "@react-native-clipboard/clipboard";
import { useQRScanner } from "../../hooks/useQRScanner";
import i18n, { useI18n } from "../../utils/i18n";
import { ScanQR } from "../camera/ScanQR";
import { Input, InputProps } from "./Input";

export const URLInput = (props: InputProps) => {
  useI18n();
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

  return (
    <>
      <Input
        label={i18n("wallet.settings.node.address")}
        placeholder={i18n("wallet.settings.node.address.placeholder")}
        {...props}
        icons={
          props.icons ?? [
            ["clipboard", pasteAddress],
            ["camera", showQR],
          ]
        }
      />
      {showQRScanner && <ScanQR onRead={onRead} onCancel={closeQR} />}
    </>
  );
};
