import { useEffect, useState } from "react";
import { Modal, TouchableOpacity, Vibration, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import tw from "../../styles/tailwind";
import i18n, { useI18n } from "../../utils/i18n";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type ScanQRProps = {
  onRead: (data: string) => void;
  onCancel: () => void;
};

export const ScanQR = ({ onRead, onCancel }: ScanQRProps) => {
  useI18n();
  const [hasReadQRCode, setHasReadQRCode] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      Vibration.vibrate();
      if (!hasReadQRCode && codes.length > 0 && codes[0].value) {
        setHasReadQRCode(true);
        onRead(codes[0].value);
      }
    },
  });

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
    })();
  }, []);

  const device = useCameraDevice("back");
  const insets = useSafeAreaInsets();
  if (!device) return null;
  return (
    <Modal animationType="none" onRequestClose={onCancel}>
      <Camera
        audio={false}
        style={tw`absolute w-full h-full rounded-2xl`}
        device={device}
        isActive
        codeScanner={codeScanner}
      />
      <View style={tw`py-2`}>
        <TouchableOpacity
          style={[tw`flex-row items-center ml-3`, { paddingTop: insets.top }]}
          onPress={onCancel}
        >
          <Icon
            id="chevronLeft"
            color={tw.color("primary-background-light-color")}
            style={tw`w-6 h-6 mr-1`}
          />
          <PeachText
            style={tw`h6 text-primary-background-light-color`}
            numberOfLines={1}
          >
            {i18n("scanBTCAddress")}
          </PeachText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
