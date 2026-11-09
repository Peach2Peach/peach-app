import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useBuyOfferDetail } from "../../hooks/query/peach069/useBuyOffer";
import { useMobilePendingActionSubmitBuyOfferProof } from "../../hooks/query/peach069/useMobilePendingActionSubmitBuyOfferProof";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { LoadingScreen } from "../loading/LoadingScreen";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { completeSubmitBuyOfferProofAction } from "../../utils/offer/completeSubmitBuyOfferProofAction";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { ActionImageWithLoader } from "./ActionImageWithLoader";

import peerToPeer from "../../assets/onboarding/peer-to-peer.png";

const ASPECT_RATIO = 0.7;
export const MobilePendingActionSubmitBuyOfferProof = () => {
  const { id } = useRoute<"mobilePendingActionSubmitBuyOfferProof">().params;
  const { width } = useWindowDimensions();
  const navigation = useStackNavigation();
  const [isConfirming, setIsConfirming] = useState(false);

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionSubmitBuyOfferProof(id);

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

  const buyOfferId = String(mobilePendingAction.buyOfferId);

  const confirmFunction = async () => {
    setIsConfirming(true);
    try {
      const completed = await completeSubmitBuyOfferProofAction({
        id,
        buyOfferId,
      });

      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "home" } },
          {
            name: completed
              ? "mobilePendingActionSubmitBuyOfferProofSuccess"
              : "mobilePendingActions",
          },
        ],
      });
    } catch (err) {
      refetch();
      setIsConfirming(false);
      throw err;
    }
  };

  return (
    <Screen
      header={
        <Header
          title={i18n(
            "connectToDesktop.mobilePendingActions.submitBuyOfferProof",
          )}
        />
      }
    >
      <View style={tw`grow flex-1 justify-between px-4`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <ActionImageWithLoader
            source={peerToPeer}
            width={width}
            height={width * ASPECT_RATIO}
            isLoading={isConfirming}
          />

          <PeachText
            style={tw`text-xl font-semibold text-center tracking-wide`}
          >
            {i18n(
              "connectToDesktop.mobilePendingActions.submitBuyOfferProof.title",
            )}
          </PeachText>
          <PeachText
            style={tw`text-base text-center font-medium text-gray-500`}
          >
            {i18n(
              "connectToDesktop.mobilePendingActions.submitBuyOfferProof.description",
            )}
          </PeachText>

          <BuyOfferDetails buyOfferId={buyOfferId} />
        </View>

        <View style={tw`pb-4`}>
          <ConfirmSlider
            enabled={mobilePendingAction.status === "pending"}
            onConfirm={confirmFunction}
            isCallbackRunning={isConfirming}
            label1={i18n(
              "connectToDesktop.mobilePendingActions.submitBuyOfferProof.action",
            )}
            label2={i18n(
              "connectToDesktop.mobilePendingActions.submitBuyOfferProof.actionDone",
            )}
          />
        </View>
      </View>
    </Screen>
  );
};

function BuyOfferDetails({ buyOfferId }: { buyOfferId: string }) {
  const { buyOffer } = useBuyOfferDetail(buyOfferId, false, false);

  return (
    <View style={tw`mt-6 items-center gap-3`}>
      <PeachText style={tw`text-base font-medium text-gray-500`}>
        {i18n("connectToDesktop.mobilePendingActions.details")}
      </PeachText>
      <PeachText style={tw`text-sm text-center`}>
        {i18n(
          "connectToDesktop.mobilePendingActions.offerId",
          offerIdToHex(buyOfferId),
        )}
      </PeachText>
      {!!buyOffer && (
        <PeachText style={tw`text-sm text-center`}>
          {i18n(
            "connectToDesktop.mobilePendingActions.amount",
            String(buyOffer.amountSats),
          )}
        </PeachText>
      )}
    </View>
  );
}
