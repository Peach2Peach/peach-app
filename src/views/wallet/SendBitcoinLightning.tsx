import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { BTCAmountInput } from "../../components/inputs/BTCAmountInput";
import { LightningInvoiceInput } from "../../components/inputs/LightningInvoiceInput";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PeachText } from "../../components/text/PeachText";
import { useValidatedState } from "../../hooks/useValidatedState";
import { ErrorPopup } from "../../popups/ErrorPopup";
import { SuccessPopup } from "../../popups/SuccessPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import {
  MSAT_PER_SAT,
  useLightningWalletBalance,
} from "./hooks/useLightningWalletBalance";
import { usePayInvoice } from "./hooks/usePayInvoice";

const invoiceRules = { lightningInvoice: true };
export const SendBitcoinLightning = () => {
  const [invoice, setInvoice, isInvoiceValid, invoiceErrors] =
    useValidatedState<string>("", invoiceRules);
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const [amount, setAmount] = useState(0);
  const [paymentRequest, setPaymentRequest] =
    useState<ReturnType<typeof bolt11.decode>>();
  const { balance } = useLightningWalletBalance();
  const invoiceAmountMsat = paymentRequest?.millisatoshis
    ? Number(paymentRequest?.millisatoshis || 0)
    : amount * MSAT_PER_SAT;
  const hasEnoughBalance = balance.lightningMsats > invoiceAmountMsat;

  const updateInvoice = (value: string) => {
    setInvoice(value);
    try {
      const decodedInvoice = bolt11.decode(value);
      if (decodedInvoice?.millisatoshis) {
        setAmount(Number(decodedInvoice.millisatoshis) / MSAT_PER_SAT);
      } else {
        setAmount(0);
      }
      setPaymentRequest(decodedInvoice);
    } catch (e) {
      // do nothing
    }
  };
  const onFocus = () => setAmount(0);

  const { payInvoice, isPayingInvoice } = usePayInvoice({
    paymentRequest,
    amount: invoiceAmountMsat,
  });
  const payInvoiceAndDisplayStatus = async () => {
    const payment = await payInvoice();
    if (payment.status === PaymentStatus.FAILED) {
      return setPopup(
        <ErrorPopup
          title={i18n("wallet.sendBitcoin.lightningPaymentFailed.title")}
          content={
            <PeachText>
              {i18n("wallet.sendBitcoin.lightningPaymentFailed.text")}
              {"\n"}
              {payment.error}
            </PeachText>
          }
          actions={
            <PopupAction
              label={i18n("close")}
              iconId="xSquare"
              onPress={closePopup}
              reverseOrder
            />
          }
        />,
      );
    }
    return setPopup(
      <SuccessPopup
        title={i18n("wallet.sendBitcoin.lightningPaymentSuccess.title")}
        content={
          <PeachText>
            {i18n("wallet.sendBitcoin.lightningPaymentSuccess.text")}
          </PeachText>
        }
        actions={
          <PopupAction
            label={i18n("close")}
            iconId="xSquare"
            onPress={closePopup}
            reverseOrder
          />
        }
      />,
    );
  };
  return (
    <Screen header={i18n("wallet.sendBitcoin.title")}>
      <View style={[tw`gap-2 py-1`, tw`md:gap-8 md:py-6`]}>
        <LightningInvoiceInput
          value={invoice}
          accessibilityHint={i18n("form.address.lightningInvoice.label")}
          label={i18n("form.address.lightningInvoice.label")}
          required={false}
          onChangeText={updateInvoice}
          errorMessage={invoiceErrors}
        />
        {paymentRequest && (
          <BTCAmountInput
            accessibilityHint={i18n("form.lightningInvoice.amount.label")}
            value={String(amount)}
            onFocus={onFocus}
            editable={!paymentRequest.millisatoshis}
            onChangeText={(text) => setAmount(Number(text))}
            size="medium"
            textStyle={tw`absolute w-full py-0 opacity-0 grow h-38px input-text`}
            containerStyle={[
              tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
              tw`border bg-primary-background-light border-black-65`,
            ]}
          />
        )}
        <Button
          onPress={payInvoiceAndDisplayStatus}
          loading={isPayingInvoice}
          disabled={
            !isInvoiceValid || invoiceAmountMsat === 0 || !hasEnoughBalance
          }
        >
          {i18n("wallet.sendBitcoin.payInvoice")}
        </Button>
      </View>
    </Screen>
  );
};
