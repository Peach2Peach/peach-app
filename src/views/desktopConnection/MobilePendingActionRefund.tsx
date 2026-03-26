import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActionRefund } from "../../hooks/query/peach069/useMobilePendingActionPaymentRefund";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { checkRefundPSBT } from "../../utils/bitcoin/checkRefundPSBT";
import i18n from "../../utils/i18n";
import { getOffer } from "../../utils/offer/getOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { signPSBT } from "../../utils/wallet/signPSBT";

export const MobilePendingActionRefund = () => {
  const { id } = useRoute<"mobilePendingActionRefund">().params;

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionRefund(id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading || !mobilePendingAction) return <></>;

  console.log("mobilePendingAction.payload", mobilePendingAction.payload);
  const { refundPSBT, derivationPathVersion } = JSON.parse(
    mobilePendingAction.payload,
  );
  const confirmFunction = async () => {
    const sellOffer = (await getOffer(
      String(mobilePendingAction.offerId),
    )) as SellOffer;
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
      await peachAPI.private.peach069.postMobilePendingActionRefund({
        id,
        signature,
      });
    if (err2) throw new Error(err2.error);
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
          {"Contract ID: " + offerIdToHex(String(mobilePendingAction.offerId))}
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
