import Clipboard from "@react-native-clipboard/clipboard";
import { useCallback, useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import "react-native-url-polyfill/auto";
import { IconType } from "../../assets/icons";
import { CENT } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { getBitcoinAddressParts } from "../../utils/bitcoin/getBitcoinAddressParts";
import { openInWallet } from "../../utils/bitcoin/openInWallet";
import i18n from "../../utils/i18n";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { Icon } from "../Icon";
import { TouchableIcon } from "../TouchableIcon";
import { PeachText } from "../text/PeachText";
import QRCode from "./QRCode";

type BitcoinAddressProps = {
  address: string;
  amount: number;
  offerId: string;
};

const SHORT_ANIMATION_DURATION = 200;
const LONG_ANIMATION_DURATION = 300;
const PADDING = 80;
export const BitcoinAddress = ({
  address,
  amount,
  offerId,
}: BitcoinAddressProps) => {
  const windowDimensions = useWindowDimensions();
  const width = windowDimensions.width - PADDING;

  const requestTextOpacity = useRef(new Animated.Value(0)).current;
  const addressTextOpacity = useRef(new Animated.Value(0)).current;

  const urn = new URL(`bitcoin:${address}`);
  const label = `${i18n("settings.escrow.paymentRequest.label")} ${offerIdToHex(offerId)}`;

  if (amount) urn.searchParams.set("amount", String(amount));
  urn.searchParams.set("message", label);
  urn.searchParams.set("label", label);

  const addressParts = getBitcoinAddressParts(address);

  const copyAddress = () => {
    Clipboard.setString(address);
    textAnimation(addressTextOpacity, SHORT_ANIMATION_DURATION);
  };

  const copyPaymentRequest = () => {
    Clipboard.setString(urn.toString());
    textAnimation(requestTextOpacity, LONG_ANIMATION_DURATION);
  };

  const openInWalletOrCopyPaymentRequest = async () => {
    if (!(await openInWallet(urn.toString()))) copyPaymentRequest();
  };

  const { isDarkMode } = useThemeStore();
  const multiOfferList = useOfferPreferences((state) => state.multiOfferList);
  const multiOffers = multiOfferList.find((list) => list.includes(offerId));
  const previousOfferId = multiOffers?.[multiOffers.indexOf(offerId) - 1];
  const nextOfferId = multiOffers?.[multiOffers.indexOf(offerId) + 1];
  const navigation = useStackNavigation();

  const goToPreviousOffer = useCallback(() => {
    if (previousOfferId) {
      navigation.navigate("fundEscrow", { offerId: previousOfferId });
    }
  }, [navigation, previousOfferId]);

  const goToNextOffer = useCallback(() => {
    if (nextOfferId) {
      navigation.navigate("fundEscrow", { offerId: nextOfferId });
    }
  }, [navigation, nextOfferId]);

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
        <View style={tw`flex-row items-center gap-1`}>
          {multiOffers && (
            <TouchableIcon
              id="chevronsLeft"
              onPress={goToPreviousOffer}
              disabled={!previousOfferId}
              style={tw`opacity-${previousOfferId ? CENT : CENT / 2}`}
            />
          )}
          <TouchableOpacity
            onPress={openInWalletOrCopyPaymentRequest}
            onLongPress={copyPaymentRequest}
          >
            <QRCode size={width} value={urn.toString()} />
          </TouchableOpacity>
          {multiOffers && (
            <TouchableIcon
              id="chevronsRight"
              onPress={goToNextOffer}
              disabled={!nextOfferId}
              style={tw`opacity-${nextOfferId ? CENT : CENT / 2}`}
            />
          )}
        </View>
      </View>

      <View style={tw`flex-row items-stretch w-full gap-2`}>
        <View
          style={tw`items-center justify-center px-3 py-2 border shrink border-black-25 rounded-xl`}
        >
          <PeachText
            style={tw`shrink ${isDarkMode ? "text-black-50" : "text-black-50"}`}
          >
            {addressParts.one}
            <PeachText
              style={tw.style(
                isDarkMode ? "text-backgroundLight-light" : "text-black-100",
              )}
            >
              {addressParts.two}
            </PeachText>
            {addressParts.three}
            <PeachText
              style={tw.style(
                isDarkMode ? "text-backgroundLight-light" : "text-black-100",
              )}
            >
              {addressParts.four}
            </PeachText>
          </PeachText>
          <Animated.View
            style={[
              tw`${
                isDarkMode
                  ? "bg-backgroundMain-dark"
                  : "bg-primary-background-light-color"
              } absolute items-center justify-center w-full h-full`,
              { opacity: addressTextOpacity },
            ]}
          >
            <PeachText style={tw`text-center text-primary-main subtitle-1`}>
              {i18n("copied")}
            </PeachText>
          </Animated.View>
        </View>

        <View style={tw`justify-center gap-2`}>
          <IconButton onPress={copyAddress} iconId="copy" />
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
        color={tw.color("primary-background-light-color")}
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
