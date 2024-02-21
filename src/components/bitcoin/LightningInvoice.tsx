import Clipboard from "@react-native-clipboard/clipboard";
import { useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import "react-native-url-polyfill/auto";
import { IconType } from "../../assets/icons";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import tw from "../../styles/tailwind";
import { openInWallet } from "../../utils/bitcoin/openInWallet";
import i18n from "../../utils/i18n";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = {
  invoice: string;
};

const MEDIUM_SCREEN_WIDTH = 327;
const SMALL_SCREEN_WIDTH = 242;
const SHORT_ANIMATION_DURATION = 200;
const LONG_ANIMATION_DURATION = 300;
export const LightningInvoice = ({ invoice }: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const width = isMediumScreen ? MEDIUM_SCREEN_WIDTH : SMALL_SCREEN_WIDTH;

  const requestTextOpacity = useRef(new Animated.Value(0)).current;
  const addressTextOpacity = useRef(new Animated.Value(0)).current;

  const urn = new URL(`lightning:${invoice}`);


  const copyInvoice = () => {
    Clipboard.setString(invoice);
    textAnimation(addressTextOpacity, SHORT_ANIMATION_DURATION);
  };

  const copyPaymentRequest = () => {
    Clipboard.setString(urn.toString());
    textAnimation(requestTextOpacity, LONG_ANIMATION_DURATION);
  };

  const openInWalletOrCopyPaymentRequest = async () => {
    if (!(await openInWallet(urn.toString()))) copyPaymentRequest();
  };

  return (
    <>
      <View>
        <Animated.View
          style={[
            tw`absolute self-center bottom-full`,
            { opacity: requestTextOpacity },
          ]}
        >
          <PeachText style={tw`text-center subtitle-2`}>
            {i18n("copied")}
          </PeachText>
        </Animated.View>
        <TouchableOpacity
          onPress={openInWalletOrCopyPaymentRequest}
          onLongPress={copyPaymentRequest}
        >
          <QRCode
            size={width}
            value={urn.toString()}
            backgroundColor={String(tw`text-primary-background-main`.color)}
          />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row items-stretch w-full gap-2`}>
        <View
          style={tw`items-center justify-center px-3 py-2 border shrink border-black-25 rounded-xl`}
        >
          <PeachText style={tw`text-black-50`}>
            {invoice.substring(0, 16)}…{invoice.substring(invoice.length - 16, invoice.length)}
          </PeachText>
          <Animated.View
            style={[
              tw`absolute items-center justify-center w-full h-full bg-primary-background-light`,
              { opacity: addressTextOpacity },
            ]}
          >
            <PeachText style={tw`text-center subtitle-1`}>
              {i18n("copied")}
            </PeachText>
          </Animated.View>
        </View>

        <View style={tw`justify-center gap-2`}>
          <IconButton onPress={copyInvoice} iconId="copy" />
          <IconButton
            iconId="externalLink"
            onPress={openInWalletOrCopyPaymentRequest}
          />
        </View>
      </View>
    </>
  );
};

function IconButton({
  onPress,
  iconId,
}: {
  onPress: () => void;
  iconId: IconType;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`items-center px-4 py-1 bg-primary-main rounded-xl`}
    >
      <Icon
        id={iconId}
        size={24}
        color={tw.color("primary-background-light")}
      />
    </TouchableOpacity>
  );
}

const DELAY = 1500;
function textAnimation(opacity: Animated.Value, duration: number) {
  Animated.sequence([
    Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
    Animated.delay(DELAY),
    Animated.timing(opacity, { toValue: 0, duration, useNativeDriver: true }),
  ]).start();
}
