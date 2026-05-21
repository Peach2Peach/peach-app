import { useFocusEffect } from "@react-navigation/native";
import { AddressIndex } from "bdk-rn/lib/lib/enums";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { ActionImageWithLoader } from "./ActionImageWithLoader";
import { useMobilePendingActionPaymentMade } from "../../hooks/query/peach069/useMobilePendingActionPaymentMade";
import { useUser69Details } from "../../hooks/query/peach069/useUser69";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { LoadingScreen } from "../loading/LoadingScreen";
import tw from "../../styles/tailwind";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { peachWallet } from "../../utils/wallet/setWallet";

import peachOfMind from "../../assets/onboarding/peach-of-mind.png";
import peerToPeer from "../../assets/onboarding/peer-to-peer.png";
import privacyFirst from "../../assets/onboarding/privacy-first.png";
import { useStackNavigation } from "../../hooks/useStackNavigation";

const images = { peachOfMind, peerToPeer, privacyFirst };
const ASPECT_RATIO = 0.7;
export const MobilePendingActionRevealAddress = () => {
  const { id } = useRoute<"mobilePendingActionRevealAddress">().params;
  const { width } = useWindowDimensions();
  const { user: selfUser } = useSelfUser();
  const { user: selfUser69 } = useUser69Details();

  const [isConfirming, setIsConfirming] = useState(false);

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionPaymentMade(id);

  const navigation = useStackNavigation();
  const navigateToSuccess = () => {
    navigation.reset({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "home" } },
        { name: "mobilePendingActionRevealAddressSuccess" },
      ],
    });
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) return <LoadingScreen />;
  if (!mobilePendingAction) {
    navigation.goBack();
    return <></>;
  }

  const { needsAddress, fiatAmount, satsAmount, currency, paymentMethod } =
    JSON.parse(mobilePendingAction.payload);

  const confirmFunction = async () => {
    setIsConfirming(true);
    try {
      if (!peachWallet) {
        throw Error("Wallet is not defined");
      }
      if (!selfUser) {
        throw Error("Self User is not defined");
      }
      if (!selfUser69) {
        throw Error("Self User69 is not defined");
      }

      let releaseAddress: string | undefined = undefined;
      let releaseAddressMessageSignature: string | undefined = undefined;
      let index: number | undefined = undefined;

      if (needsAddress) {
        if (selfUser69.lastAddressUsedIndex === undefined) {
          const getAddressResult = await peachWallet.getAddress(
            AddressIndex.New,
          );
          releaseAddress = getAddressResult.address;
          index = getAddressResult.index;
        } else {
          const getAddressResult = await peachWallet.getAddress(
            AddressIndex.LastUnused,
          );
          if (getAddressResult.index > selfUser69.lastAddressUsedIndex) {
            releaseAddress = getAddressResult.address;
            index = getAddressResult.index;
          } else {
            while (true) {
              const getNewAddressResult = await peachWallet.getAddress(
                AddressIndex.New,
              );
              if (
                getNewAddressResult.index > selfUser69.lastAddressUsedIndex
              ) {
                releaseAddress = getNewAddressResult.address;
                index = getNewAddressResult.index;
                break;
              }
            }
          }
        }

        const message = getMessageToSignForAddress(selfUser.id, releaseAddress);

        releaseAddressMessageSignature = peachWallet.signMessage(
          message,
          index,
        );
      }
      const { error: err } =
        await peachAPI.private.peach069.postMobilePendingActionPaymentMade({
          id,
          releaseAddress,
          releaseAddressMessageSignature,
        });
      if (err) throw new Error(err.error);

      if (index)
        await peachAPI.private.peach069.setLastAddressUsedIndexOnSelfUser69({
          index,
        });

      navigateToSuccess();
    } catch (err) {
      refetch();
      setIsConfirming(false);
      throw err;
    }
  };

  return (
    <Screen
      header={<Header title={i18n("connectToDesktop.mobilePendingActions.paymentMade")} />}
    >
      <View style={tw`grow flex-1 justify-between px-4`}>
        {/* Center Content */}
        <View style={[tw`flex-1 items-center justify-center`]}>
          <PeachText
            style={tw`text-xl font-semibold text-center tracking-wide`}
          >
            {i18n("connectToDesktop.mobilePendingActions.paymentMade.title")}
          </PeachText>
          <PeachText
            style={tw`text-base text-center font-medium text-gray-500`}
          >
            {i18n(
              "connectToDesktop.mobilePendingActions.paymentMade.description",
            )}
          </PeachText>

          <ActionImageWithLoader
            source={images.peerToPeer}
            width={width}
            height={width * ASPECT_RATIO}
            isLoading={isConfirming}
          />

          <View style={tw`mt-6 items-center`}>
            <PeachText style={tw`text-base font-medium text-gray-500`}>
              {i18n("connectToDesktop.mobilePendingActions.details")}
            </PeachText>

            <PeachText style={tw`text-sm text-center mt-1`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.contractId",
                contractIdToHex(mobilePendingAction.contractId),
              )}
            </PeachText>
            <PeachText style={tw`text-sm text-center mt-1`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.paymentMade.youMustPay",
                String(fiatAmount),
                String(currency),
              )}
            </PeachText>
            <PeachText style={tw`text-sm text-center mt-1`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.paymentMade.paymentMethod",
                String(paymentMethod),
              )}
            </PeachText>
            <PeachText style={tw`text-sm text-center mt-1`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.paymentMade.youWillReceive",
                String(satsAmount),
              )}
            </PeachText>
          </View>
        </View>

        {/* Bottom Slider */}
        <View style={tw`pb-4`}>
          <ConfirmSlider
            enabled={mobilePendingAction.status === "pending"}
            onConfirm={confirmFunction}
            isCallbackRunning={isConfirming}
            label1={i18n("contract.payment.buyer.confirm")}
            label2={i18n("contract.payment.made")}
          />
        </View>
      </View>
    </Screen>
  );
};
