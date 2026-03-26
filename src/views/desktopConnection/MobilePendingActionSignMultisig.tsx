import { NETWORK } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { crypto, Psbt } from "bitcoinjs-lib";
import { useCallback } from "react";
import { View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActionPaymentConfirmed } from "../../hooks/query/peach069/useMobilePendingActionPaymentConfirmed";
import { useRoute } from "../../hooks/useRoute";
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

export const MobilePendingActionSignMultisig = () => {
  const { id } = useRoute<"mobilePendingActionSignMultisig">().params;

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionPaymentConfirmed(id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading || !mobilePendingAction) return <></>;

  console.log("mobilePendingAction.payload", mobilePendingAction.payload);

  const confirmFunction = async () => {
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
  };

  return (
    <Screen
      header={
        <Header
          title={i18n("connectToDesktop.mobilePendingActionSingMultisig")}
        />
      }
    >
      <View style={tw`grow`}>
        <PeachText>{"Send the Escrowed BTC to the Buyer"}</PeachText>

        <PeachText>
          {"Contract ID: " + contractIdToHex(mobilePendingAction.contractId)}
        </PeachText>

        <Button
          disabled={mobilePendingAction.status !== "pending"}
          onPress={() => {
            confirmFunction().finally(refetch);
          }}
        >
          {"Confirm"}
        </Button>
      </View>
    </Screen>
  );
};
