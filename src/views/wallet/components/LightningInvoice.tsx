import Clipboard from "@react-native-clipboard/clipboard";
import { useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import "react-native-url-polyfill/auto";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import { useIsMediumScreen } from "../../../hooks/useIsMediumScreen";
import tw from "../../../styles/tailwind";
import { openInWallet } from "../../../utils/bitcoin/openInWallet";
import i18n from "../../../utils/i18n";

type Props = {
  invoice: string;
};

const MEDIUM_SCREEN_WIDTH = 327;
const SMALL_SCREEN_WIDTH = 275;
const LONG_ANIMATION_DURATION = 300;
const CUTOFF = 21;
export const LightningInvoice = ({ invoice }: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const width = isMediumScreen ? MEDIUM_SCREEN_WIDTH : SMALL_SCREEN_WIDTH;
  const requestTextOpacity = useRef(new Animated.Value(0)).current;

  const urn = new URL(`lightning:${invoice}`);

  const copyPaymentRequest = () => {
    Clipboard.setString(urn.toString());
    textAnimation(requestTextOpacity, LONG_ANIMATION_DURATION);
  };

  const openInWalletOrCopyPaymentRequest = async () => {
    if (!(await openInWallet(urn.toString()))) copyPaymentRequest();
  };

  return (
    <View style={tw`gap-8 items-center`}>
      <View style={tw`gap-8`}>
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
        <View style={tw`flex-row items-center justify-between gap-3`}>
          <PeachText style={tw`shrink text-black-50 body-l`}>
            {`${invoice.substring(0, CUTOFF)}…${invoice.substring(invoice.length - CUTOFF, invoice.length)}`}
          </PeachText>
          <CopyAble
            value={invoice}
            style={tw`w-6 h-6`}
            color={tw`text-primary-main`}
          />
        </View>
      </View>
    </View>
  );
};

const DELAY = 1500;
function textAnimation(opacity: Animated.Value, duration: number) {
  Animated.sequence([
    Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
    Animated.delay(DELAY),
    Animated.timing(opacity, { toValue: 0, duration, useNativeDriver: true }),
  ]).start();
}
