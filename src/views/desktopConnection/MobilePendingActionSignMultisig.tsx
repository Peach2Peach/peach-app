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
import { verifyBuyerReleaseAddress } from "../../utils/contract/verifyBuyerReleaseAddress";
import { verifyContractTradeDetailsById } from "../../utils/contract/verifyContractTradeDetails";
import { verifyReleasePSBT } from "../../utils/contract/verifyReleasePSBT";
import i18n from "../../utils/i18n";
import { isBuyerOnlyEscrow } from "../../utils/offer/isBuyerOnlyEscrow";
import { isSingleSigEscrow } from "../../utils/offer/isSingleSigEscrow";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { getNetwork } from "../../utils/wallet/getNetwork";
import {
  ReleasePendingActionPayload,
  signEscrowPSBT,
} from "../../utils/wallet/signEscrowPSBT";
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

  const navigateToSuccess = () =>
    navigation.reset({
      index: 1,
      routes: [
        { name: "homeScreen", params: { screen: "home" } },
        { name: "mobilePendingActionSignMultisigSuccess" },
      ],
    });

  const confirmFunction = async () => {
    setIsConfirming(true);
    try {
      const sellOffer = await getSellOfferFromContract({
        id: mobilePendingAction.contractId,
      });

      if (!sellOffer) throw new Error("SELL_OFFER_NOT_FOUND");

      // the payload itself says which escrow this is - anything other than 2
      // takes the legacy path
      const payload: ReleasePendingActionPayload = JSON.parse(
        mobilePendingAction.payload,
      );

      verifyBuyerReleaseAddress({
        mustValidate: payload.mustValidateBuyerReleaseProofs,
        buyerId: payload.buyerId,
        releaseAddress: payload.releaseAddress,
        releaseAddressMessageSignature: payload.releaseAddressMessageSignature,
        peachUserSignature: payload.peachUserSignature,
      });

      // the buyer already signed the release when marking the payment as made
      if (isBuyerOnlyEscrow(sellOffer)) {
        const { error: buyerOnlyError } =
          await peachAPI.private.peach069.postMobilePendingActionPaymentConfirmed(
            { id },
          );
        if (buyerOnlyError) throw new Error(buyerOnlyError.error);
        navigateToSuccess();
        return;
      }

      // a contract from a (non instant trade) sell offer must carry trade
      // details naming this buyer, signed by both parties
      await verifyContractTradeDetailsById({
        contractId: mobilePendingAction.contractId,
        sellOffer,
      });

      const wallet = getEscrowWalletForOffer(sellOffer);

      if (!payload.releasePsbt) throw new Error("MISSING_DATA");
      const psbt = Psbt.fromBase64(payload.releasePsbt, {
        network: getNetwork(),
      });

      // the release address only comes (already verified above) when the
      // server requires the proofs: only then check the PSBT pays it
      const releaseAddress =
        payload.mustValidateBuyerReleaseProofs === true
          ? payload.releaseAddress
          : undefined;
      const { txIds } = sellOffer.funding;
      verifyReleasePSBT(psbt, txIds, releaseAddress);

      // batching needs Peach to co-sign, which is impossible without a Peach
      // key, so it is off for escrowVersion 2 and nothing is sent back
      const batchPsbt =
        payload.batchReleasePsbt && !isSingleSigEscrow(payload)
          ? Psbt.fromBase64(payload.batchReleasePsbt, { network: getNetwork() })
          : undefined;

      if (batchPsbt) {
        verifyReleasePSBT(batchPsbt, txIds, releaseAddress);
        signPSBT(batchPsbt, wallet);
      }

      const [signature] = signEscrowPSBT(psbt, wallet, payload);

      const { error: err } =
        await peachAPI.private.peach069.postMobilePendingActionPaymentConfirmed(
          {
            id,
            releaseTransactionSignature: signature,
            batchReleasePsbt: batchPsbt?.toBase64(),
          },
        );
      if (err) throw new Error(err.error);

      navigateToSuccess();
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
