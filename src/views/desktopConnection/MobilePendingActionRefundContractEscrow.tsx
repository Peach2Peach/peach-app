import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { ActionImageWithLoader } from "./ActionImageWithLoader";
import { useMobilePendingActionRefundContractEscrow } from "../../hooks/query/peach069/useMobilePendingActionRefundContractEscrow";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { checkRefundPSBT } from "../../utils/bitcoin/checkRefundPSBT";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getSellOfferFromContract } from "../../utils/contract/getSellOfferFromContract";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { signPSBT } from "../../utils/wallet/signPSBT";

import peerToPeer from "../../assets/onboarding/peer-to-peer.png";

const ASPECT_RATIO = 0.7;
export const MobilePendingActionRefundContractEscrow = () => {
  const { contractId } =
    useRoute<"mobilePendingActionRefundContractEscrow">().params;
  const { width } = useWindowDimensions();
  const navigation = useStackNavigation();
  const [isConfirming, setIsConfirming] = useState(false);

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionRefundContractEscrow(contractId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) return <></>;
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
      const numberOfSignatures = psbt.data.inputs[0].partialSig?.length;
      if (!numberOfSignatures) {
        throw Error("signatures missing");
      }
      const signature =
        psbt.data.inputs[0].partialSig?.[
          numberOfSignatures - 1
        ].signature.toString("hex");
      if (!signature) {
        throw Error("signature missing");
      }

      const { error: err2 } =
        await peachAPI.private.peach069.postMobilePendingActionRefundContractEscrow({
          contractId,
          signature,
        });
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
      header={<Header title={i18n("connectToDesktop.mobilePendingActions.refundEscrowContract")} />}
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
            {"Refund Escrow"}
          </PeachText>
          <PeachText
            style={tw`text-base text-center font-medium text-gray-500`}
          >
            {"Slide to sign the refund transaction and get your funds back."}
          </PeachText>

          <View style={tw`mt-6 items-center gap-3`}>
            <PeachText style={tw`text-base font-medium text-gray-500`}>
              {"Details"}
            </PeachText>
            <PeachText style={tw`text-sm text-center`}>
              {"Contract ID: " +
                contractIdToHex(mobilePendingAction.contractId)}
            </PeachText>
          </View>
        </View>

        <View style={tw`pb-4`}>
          <ConfirmSlider
            enabled={mobilePendingAction.status === "pending"}
            onConfirm={confirmFunction}
            isCallbackRunning={isConfirming}
            label1={"Refund"}
            label2={"Refunded!"}
          />
        </View>
      </View>
    </Screen>
  );
};
