import { useFocusEffect } from "@react-navigation/native";
import { Psbt } from "bitcoinjs-lib";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActionPaymentConfirmed } from "../../hooks/query/peach069/useMobilePendingActionPaymentConfirmed";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { LoadingScreen } from "../loading/LoadingScreen";
import tw from "../../styles/tailwind";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getSellOfferFromContract } from "../../utils/contract/getSellOfferFromContract";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { signPSBT } from "../../utils/wallet/signPSBT";
import { ActionImageWithLoader } from "./ActionImageWithLoader";

import peerToPeer from "../../assets/onboarding/peer-to-peer.png";

const ASPECT_RATIO = 0.7;
export const MobilePendingActionSignMultisig = () => {
  const { id } = useRoute<"mobilePendingActionSignMultisig">().params;
  const { width } = useWindowDimensions();
  const navigation = useStackNavigation();
  const [isConfirming, setIsConfirming] = useState(false);

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionPaymentConfirmed(id);
  console.log("mobilePendingAction", mobilePendingAction);
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

  const confirmFunction = async () => {
    setIsConfirming(true);
    try {
      const sellOffer = await getSellOfferFromContract({
        id: mobilePendingAction.contractId,
      });

      if (!sellOffer) throw new Error("SELL_OFFER_NOT_FOUND");

      const wallet = getEscrowWalletForOffer(sellOffer);

      const { batchReleasePsbt, releasePsbt } = JSON.parse(
        mobilePendingAction.payload,
      );

      const psbt = Psbt.fromBase64(releasePsbt, { network: getNetwork() });

      const batchPsbt = batchReleasePsbt
        ? Psbt.fromBase64(batchReleasePsbt, { network: getNetwork() })
        : undefined;

      if (batchPsbt) {
        signPSBT(batchPsbt, wallet);
      }
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

      const { error: err } =
        await peachAPI.private.peach069.postMobilePendingActionPaymentConfirmed(
          {
            id,
            releaseTransactionSignature: signature,
            batchReleasePsbt: batchPsbt?.toBase64(),
          },
        );
      if (err) throw new Error(err.error);

      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "home" } },
          { name: "mobilePendingActionSignMultisigSuccess" },
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
          title={i18n("connectToDesktop.mobilePendingActions.paymentConfirmed")}
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
              "connectToDesktop.mobilePendingActions.paymentConfirmed.title",
            )}
          </PeachText>
          <PeachText
            style={tw`text-base text-center font-medium text-gray-500`}
          >
            {i18n(
              "connectToDesktop.mobilePendingActions.paymentConfirmed.description",
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
              "connectToDesktop.mobilePendingActions.paymentConfirmed.action",
            )}
            label2={i18n(
              "connectToDesktop.mobilePendingActions.paymentConfirmed.actionDone",
            )}
          />
        </View>
      </View>
    </Screen>
  );
};
