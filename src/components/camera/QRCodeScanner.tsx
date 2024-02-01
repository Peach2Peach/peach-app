import { useEffect, useRef, useState } from "react";

import { Animated, Easing, Vibration } from "react-native";

import { BarCodeReadEvent, RNCamera } from "react-native-camera";
import tw from "../../styles/tailwind";

type Props = {
  customMarker: JSX.Element;
  onRead: (e: BarCodeReadEvent) => void;
};
export const QRCodeScanner = ({ customMarker, onRead }: Props) => {
  const [hasReadQRCode, setHasReadQRCode] = useState(false);
  const fadeInOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeInOpacity, {
      toValue: 1,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [fadeInOpacity]);

  const onBarCodeRead = (e: BarCodeReadEvent) => {
    if (!hasReadQRCode) {
      Vibration.vibrate();
      setHasReadQRCode(true);
      onRead(e);
    }
  };

  return (
    <Animated.View
      style={[tw`w-full h-full bg-black-100`, { opacity: fadeInOpacity }]}
    >
      <RNCamera
        androidCameraPermissionOptions={{
          title: "Info",
          message: "Need camera permission",
          buttonPositive: "OK",
        }}
        onBarCodeRead={onBarCodeRead}
        captureAudio={false}
        style={tw`bg-transparent`}
      >
        {customMarker}
      </RNCamera>
    </Animated.View>
  );
};
