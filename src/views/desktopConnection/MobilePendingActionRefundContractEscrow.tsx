import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActionRefundContractEscrow } from "../../hooks/query/peach069/useMobilePendingActionRefundContractEscrow";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { LoadingScreen } from "../loading/LoadingScreen";
import tw from "../../styles/tailwind";
import { checkRefundPSBT } from "../../utils/bitcoin/checkRefundPSBT";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getSellOfferFromContract } from "../../utils/contract/getSellOfferFromContract";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { signPSBT } from "../../utils/wallet/signPSBT";
import { ActionImageWithLoader } from "./ActionImageWithLoader";

import peerToPeer from "../../assets/onboarding/peer-to-peer.png";

const ASPECT_RATIO = 0.7;
export const MobilePendingActionRefundContractEscrow = () => {
  const { id } = useRoute<"mobilePendingActionRefundContractEscrow">().params;
  const { width } = useWindowDimensions();
  const navigation = useStackNavigation();
  const [isConfirming, setIsConfirming] = useState(false);

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionRefundContractEscrow(id);

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

  const { refundPSBT } = JSON.parse(mobilePendingAction.payload);

  const confirmFunction = async () => {
    setIsConfirming(true);
    try {
      const sellOffer = await getSellOfferFromContract({
        id: mobilePendingAction.contractId,
      });

      if (!sellOffer) throw new Error("SELL_OFFER_NOT_FOUND");

      const { psbt, err } = checkRefundPSBT(refundPSBT, sellOffer);
      if (!psbt || err) {
        throw new Error(err || "Invalid PSBT");
      }
      const wallet = getEscrowWalletForOffer(sellOffer);

      signPSBT(psbt, wallet);
      const signatures = psbt.data.inputs.map((input) => {
        const numberOfSignatures = input.partialSig?.length;
        if (!input.partialSig || !numberOfSignatures) {
          throw Error("signatures missing");
        }
        return input.partialSig[numberOfSignatures - 1].signature.toString(
          "hex",
        );
      });

      const { error: err2 } =
        await peachAPI.private.peach069.postMobilePendingActionRefundContractEscrow(
          {
            id,
            signatures,
          },
        );
      if (err2) throw new Error(err2.error);

      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "home" } },
          { name: "mobilePendingActionRefundContractEscrowSuccess" },
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
            "connectToDesktop.mobilePendingActions.refundEscrowContract",
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
            {i18n("connectToDesktop.mobilePendingActions.refundEscrow.title")}
          </PeachText>
          <PeachText
            style={tw`text-base text-center font-medium text-gray-500`}
          >
            {i18n(
              "connectToDesktop.mobilePendingActions.refundEscrow.description",
            )}
          </PeachText>

          <View style={tw`mt-6 items-center gap-3`}>
            <PeachText style={tw`text-base font-medium text-gray-500`}>
              {i18n("connectToDesktop.mobilePendingActions.details")}
            </PeachText>
            <PeachText style={tw`text-sm text-center`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.contractId",
                contractIdToHex(mobilePendingAction.contractId),
              )}
            </PeachText>
          </View>
        </View>

        <View style={tw`pb-4`}>
          <ConfirmSlider
            enabled={mobilePendingAction.status === "pending"}
            onConfirm={confirmFunction}
            isCallbackRunning={isConfirming}
            label1={i18n(
              "connectToDesktop.mobilePendingActions.refundEscrow.action",
            )}
            label2={i18n(
              "connectToDesktop.mobilePendingActions.refundEscrow.actionDone",
            )}
          />
        </View>
      </View>
    </Screen>
  );
};
