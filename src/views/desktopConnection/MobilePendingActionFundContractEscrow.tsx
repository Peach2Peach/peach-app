import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { ActionImageWithLoader } from "./ActionImageWithLoader";
import { useMobilePendingActionFundContractEscrow } from "../../hooks/query/peach069/useMobilePendingActionFundContractEscrow";
import { useFeeRate } from "../../hooks/useFeeRate";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { LoadingScreen } from "../loading/LoadingScreen";
import tw from "../../styles/tailwind";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { peachWallet } from "../../utils/wallet/setWallet";
import { buildTransaction } from "../../utils/wallet/transaction";
import { useWalletState } from "../../utils/wallet/walletStore";
import { useSyncWallet } from "../wallet/hooks/useSyncWallet";

import peerToPeer from "../../assets/onboarding/peer-to-peer.png";

const ASPECT_RATIO = 0.7;
export const MobilePendingActionFundContractEscrow = () => {
  const { id } =
    useRoute<"mobilePendingActionFundContractEscrow">().params;
  const { width } = useWindowDimensions();
  const navigation = useStackNavigation();
  const [isConfirming, setIsConfirming] = useState(false);

  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionFundContractEscrow(id);

  useSyncWallet({ enabled: true });
  const balance = useWalletState((state) => state.balance);
  const feeRate = useFeeRate();

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

  const { address, amount } = JSON.parse(mobilePendingAction.payload) as {
    address: string;
    amount: number;
  };

  const hasSufficientFunds = balance >= amount;

  const confirmFunction = async () => {
    setIsConfirming(true);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    try {
      if (!peachWallet) throw new Error("Wallet not defined");

      const transaction = await buildTransaction({
        address,
        amount,
        feeRate,
      });
      const { psbt } = await peachWallet.finishTransaction(transaction);
      if (!peachWallet.wallet) throw new Error("Wallet not ready");
      const signedPSBT = await peachWallet.wallet.sign(psbt);
      const tx = await signedPSBT.extractTx();
      const txHex = Buffer.from(await tx.serialize()).toString("hex");

      const { error: err } =
        await peachAPI.private.peach069.postMobilePendingActionFundContractEscrow({
          id,
          txHex,
        });
      if (err) throw new Error(err.error);

      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "home" } },
          { name: "mobilePendingActionFundContractEscrowSuccess" },
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
      header={<Header title={i18n("connectToDesktop.mobilePendingActions.fundEscrowContract")} />}
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
            {i18n("connectToDesktop.mobilePendingActions.fundEscrow.title")}
          </PeachText>
          <PeachText
            style={tw`text-base text-center font-medium text-gray-500`}
          >
            {i18n(
              "connectToDesktop.mobilePendingActions.fundEscrow.description",
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
            <PeachText style={tw`text-sm text-center`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.escrowAddress",
                address,
              )}
            </PeachText>
            <PeachText style={tw`text-sm text-center`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.amount",
                String(amount),
              )}
            </PeachText>
          </View>

          {!hasSufficientFunds && (
            <PeachText style={tw`text-sm text-center text-error-main mt-4`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.insufficientBalance",
                String(amount),
              )}
            </PeachText>
          )}
        </View>

        <View style={tw`pb-4`}>
          <ConfirmSlider
            enabled={
              mobilePendingAction.status === "pending" && hasSufficientFunds
            }
            onConfirm={confirmFunction}
            isCallbackRunning={isConfirming}
            label1={i18n(
              "connectToDesktop.mobilePendingActions.fundEscrow.action",
            )}
            label2={i18n(
              "connectToDesktop.mobilePendingActions.fundEscrow.actionDone",
            )}
          />
        </View>
      </View>
    </Screen>
  );
};
