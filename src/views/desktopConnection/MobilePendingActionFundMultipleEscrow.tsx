import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Header } from "../../components/Header";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useMobilePendingActionFundMultipleEscrow } from "../../hooks/query/peach069/useMobilePendingActionFundMultipleEscrow";
import { useFeeRate } from "../../hooks/useFeeRate";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { LoadingScreen } from "../loading/LoadingScreen";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { Amount } from "bdk-rn";
import { peachWallet } from "../../utils/wallet/setWallet";
import { buildTransaction } from "../../utils/wallet/transaction";
import { getScriptPubKeyFromAddress } from "../../utils/wallet/transaction/getScriptPubKeyFromAddress";
import { useWalletState } from "../../utils/wallet/walletStore";
import { useSyncWallet } from "../wallet/hooks/useSyncWallet";

type Recipient = { address: string; amount: number };

export const MobilePendingActionFundMultipleEscrow = () => {
  const { id } = useRoute<"mobilePendingActionFundMultipleEscrow">().params;
  const navigation = useStackNavigation();
  const [isConfirming, setIsConfirming] = useState(false);
  const { mobilePendingAction, isLoading, refetch } =
    useMobilePendingActionFundMultipleEscrow(id);

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

  const recipients = JSON.parse(mobilePendingAction.payload) as Recipient[];
  const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);
  const hasSufficientFunds = balance >= totalAmount;

  const confirmFunction = async () => {
    setIsConfirming(true);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    try {
      if (!peachWallet) throw new Error("Wallet not defined");

      let txBuilder = await buildTransaction({ feeRate });
      for (const recipient of recipients) {
        const scriptPubKey = getScriptPubKeyFromAddress(recipient.address);
        txBuilder = txBuilder.addRecipient(
          scriptPubKey,
          Amount.fromSat(BigInt(recipient.amount)),
        );
      }

      const psbt = await peachWallet.finishTransaction(txBuilder);
      if (!peachWallet.wallet) throw new Error("Wallet not ready");
      peachWallet.wallet.sign(psbt, undefined);
      const tx = psbt.extractTx();
      const txHex = Buffer.from(tx.serialize() as ArrayBuffer).toString("hex");

      const { error: err } =
        await peachAPI.private.peach069.postMobilePendingActionFundMultipleEscrow(
          { id, txHex },
        );
      if (err) throw new Error(err.error);

      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "home" } },
          { name: "mobilePendingActionFundMultipleEscrowSuccess" },
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
            "connectToDesktop.mobilePendingActions.fundMultipleEscrow",
          )}
        />
      }
    >
      <View style={tw`flex-1 justify-between px-4`}>
        <View style={tw`flex-1`}>
          <View style={tw`items-center mt-2`}>
            <PeachText
              style={tw`text-xl font-semibold text-center tracking-wide`}
            >
              {i18n(
                "connectToDesktop.mobilePendingActions.fundMultipleEscrow.title",
              )}
            </PeachText>
            <PeachText
              style={tw`text-base text-center font-medium text-gray-500 mt-1`}
            >
              {i18n(
                "connectToDesktop.mobilePendingActions.fundMultipleEscrow.description",
              )}
            </PeachText>
          </View>

          {isConfirming && (
            <View style={tw`items-center my-4`}>
              <ActivityIndicator size="large" />
            </View>
          )}

          <View style={tw`flex-1 mt-4`}>
            <PeachText style={tw`text-base font-medium text-gray-500 mb-2`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.fundMultipleEscrow.recipients",
              )}
            </PeachText>
            <ScrollView
              style={tw`flex-1`}
              persistentScrollbar
              showsVerticalScrollIndicator
            >
              {recipients.map((recipient, index) => (
                <View
                  key={`${index}-${recipient.address}`}
                  style={tw`flex-row items-center justify-between py-2 border-b border-gray-200`}
                >
                  <View style={tw`flex-row items-center flex-1 mr-2`}>
                    <PeachText
                      style={tw`text-sm text-gray-500 mr-2 w-6`}
                    >
                      {`${index + 1}.`}
                    </PeachText>
                    <PeachText
                      style={tw`text-sm flex-1`}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {`${recipient.address.slice(0, 9)}…${recipient.address.slice(-9)}`}
                    </PeachText>
                  </View>
                  <PeachText style={tw`text-sm font-medium`}>
                    {i18n(
                      "connectToDesktop.mobilePendingActions.sats",
                      String(recipient.amount),
                    )}
                  </PeachText>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={tw`pb-4`}>
          <View style={tw`flex-row items-center justify-between py-2`}>
            <PeachText style={tw`text-base font-semibold`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.fundMultipleEscrow.total",
              )}
            </PeachText>
            <PeachText style={tw`text-base font-semibold`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.sats",
                String(totalAmount),
              )}
            </PeachText>
          </View>

          {!hasSufficientFunds && (
            <PeachText style={tw`text-sm text-center text-error-main mb-2`}>
              {i18n(
                "connectToDesktop.mobilePendingActions.insufficientBalance",
                String(totalAmount),
              )}
            </PeachText>
          )}

          <ConfirmSlider
            enabled={
              mobilePendingAction.status === "pending" && hasSufficientFunds
            }
            onConfirm={confirmFunction}
            isCallbackRunning={isConfirming}
            label1={i18n(
              "connectToDesktop.mobilePendingActions.fundMultipleEscrow.action",
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
