import { NETWORK } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { crypto, Psbt } from "bitcoinjs-lib";
import { useCallback, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActionPaymentConfirmed } from "../../hooks/query/peach069/useMobilePendingActionPaymentConfirmed";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { getMainAccount } from "../../utils/account/getMainAccount";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getSellOfferFromContract } from "../../utils/contract/getSellOfferFromContract";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { getWallet } from "../../utils/wallet/getWallet";
import { signPSBT } from "../../utils/wallet/signPSBT";

import peerToPeer from "../../assets/onboarding/peer-to-peer.png";

const ASPECT_RATIO = 0.7;
export const MobilePendingActionSignMultisig = () => {
  const { id } = useRoute<"mobilePendingActionSignMultisig">().params;
  const { width } = useWindowDimensions();
  const navigation = useStackNavigation();
  const [isConfirming, setIsConfirming] = useState(false);

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionPaymentConfirmed(id);

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

  const confirmFunction = async () => {
    setIsConfirming(true);
    try {
      const sellOffer = await getSellOfferFromContract({
        id: mobilePendingAction.contractId,
      });

      if (!sellOffer) throw new Error("SELL_OFFER_NOT_FOUND");

      const wallet = getEscrowWalletForOffer(sellOffer);

      const { batchReleasePsbt, releasePsbt, buyerId } = JSON.parse(
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

      const keyPair =
        peachAPI.apiOptions.peachAccount || getMainAccount(getWallet(), NETWORK);

      const ratingSignature = keyPair
        .sign(crypto.sha256(Buffer.from(buyerId)))
        .toString("hex");

      const { error: err } =
        await peachAPI.private.peach069.postMobilePendingActionPaymentConfirmed({
          id,
          releaseTransactionSignature: signature,
          batchReleasePsbt: batchPsbt?.toBase64(),
          ratingSignature,
        });
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
      header={<Header title={i18n("connectToDesktop.mobilePendingActions.paymentConfirmed")} />}
    >
      <View style={tw`grow flex-1 justify-between px-4`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <Image
            source={peerToPeer}
            style={{ width, height: width * ASPECT_RATIO }}
            resizeMode="contain"
          />

          <PeachText
            style={tw`text-xl font-semibold text-center tracking-wide`}
          >
            {"Send the Escrowed BTC to the Buyer"}
          </PeachText>
          <PeachText
            style={tw`text-base text-center font-medium text-gray-500`}
          >
            {"Slide to sign the release transaction and send the Bitcoin."}
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
            label1={"Release Bitcoin"}
            label2={"Released!"}
          />
        </View>
      </View>
    </Screen>
  );
};
