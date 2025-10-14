import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type ScanQRProps = {
  onRead: (data: string) => void;
  onCancel: () => void;
};

export const ScanQR = ({ onRead, onCancel }: ScanQRProps) => {
  const [hasReadQRCode, setHasReadQRCode] = useState(false);
  const fadeInOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeInOpacity, {
      toValue: 1,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [fadeInOpacity]);

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

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  if (!device) return null;
  return (
    <Modal transparent={false} onRequestClose={onCancel}>
      <Animated.View
        style={[tw`w-full h-full bg-black-100`, { opacity: fadeInOpacity }]}
      >
        <Camera
          audio={false}
          style={tw`bg-transparent`}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        >
          <CustomMarker onCancel={onCancel} />
        </Camera>
      </Animated.View>
    </Modal>
  );
};

function CustomMarker({ onCancel }: Pick<ScanQRProps, "onCancel">) {
  return (
    <View style={tw`w-full h-full`}>
      <CircleMask />
      <SafeAreaView style={tw`py-2`}>
        <TouchableOpacity
          style={tw`flex-row items-center ml-3`}
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
      </SafeAreaView>
    </View>
  );
}

function CircleMask() {
  return (
    <Svg style={tw`absolute top-0 left-0 w-full h-full`}>
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect
            x={"10%"}
            y={"30%"}
            rx={20}
            width={"80%"}
            height={"40%"}
            fill={"black"}
          />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(0, 0, 0, 0.6)"
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );
}
