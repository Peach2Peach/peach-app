import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { BTCAmountInput } from "../../components/inputs/BTCAmountInput";
import { Dropdown } from "../../components/inputs/Dropdown";
import { LightningInvoiceInput } from "../../components/inputs/LightningInvoiceInput";
import { NumberInput } from "../../components/inputs/NumberInput";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PeachText } from "../../components/text/PeachText";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useValidatedState } from "../../hooks/useValidatedState";
import { CURRENCIES } from "../../paymentMethods";
import { ErrorPopup } from "../../popups/ErrorPopup";
import { SuccessPopup } from "../../popups/SuccessPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { getFiatPrice } from "./helpers/getFiatPrice";
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
  const invoiceLabel = paymentRequest?.tagsObject.description;
  const hasEnoughBalance = balance.lightningMsats > invoiceAmountMsat;
  const { data: prices = {} } = useMarketPrices();
  const displayCurrency = useSettingsStore((state) => state.displayCurrency);
  const [currency, setCurreny] = useState(displayCurrency);
  const price = prices[currency] || 0;
  const fiat = useMemo(
    () => getFiatPrice(invoiceAmountMsat / MSAT_PER_SAT, price),
    [invoiceAmountMsat, price],
  );

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
            <>
              <Icon
                id="xCircle"
                style={tw`self-center`}
                color={tw.color("error-main")}
                size={64}
              />
              <PeachText>{payment.error}</PeachText>
            </>
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
          <Icon
            id="checkCircle"
            style={tw`self-center`}
            color={tw.color("success-main")}
            size={64}
          />
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
    <Screen
      style={tw`justify-between`}
      header={i18n("wallet.sendBitcoin.title")}
    >
      <View style={[tw`py-1`, tw`gap-8 md:py-6`]}>
        <PeachText style={tw`text-center body-l`}>
          {invoiceLabel
            ? invoiceLabel
            : i18n("wallet.sendBitcoin.pasteInvoiceBelow")}
        </PeachText>
        <LightningInvoiceInput
          value={invoice}
          accessibilityHint={i18n("form.address.lightningInvoice.label")}
          required={false}
          onChangeText={updateInvoice}
          errorMessage={invoiceErrors}
        />
        <View style={tw`gap-2`}>
          <PeachText style={tw`pl-2 input-title`}>
            {i18n("form.lightningInvoice.amount.label")}
          </PeachText>
          <BTCAmountInput
            chain="lightning"
            accessibilityHint={i18n("form.lightningInvoice.amount.label")}
            value={String(amount)}
            onFocus={onFocus}
            editable={paymentRequest && !paymentRequest.millisatoshis}
            onChangeText={(text) =>
              setAmount(Number(text.replace(/[^0-9]/gu, "")))
            }
            size="medium"
            textStyle={tw`absolute w-full py-0 opacity-0 grow h-38px input-text`}
            containerStyle={[
              tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
              tw`border bg-primary-background-light border-black-65`,
            ]}
          />
          <View style={tw`flex-row gap-2`}>
            <View style={tw`flex-shrink`}>
              <NumberInput
                accessibilityHint={i18n("form.lightningInvoice.fiat.label")}
                decimals={2}
                value={fiat}
                disabled={true}
              />
            </View>
            <Dropdown
              value={currency}
              onChange={setCurreny}
              options={CURRENCIES}
            />
          </View>
        </View>
      </View>
      <Button
        style={tw`bg-success-main`}
        onPress={payInvoiceAndDisplayStatus}
        loading={isPayingInvoice}
        disabled={
          !isInvoiceValid || invoiceAmountMsat === 0 || !hasEnoughBalance
        }
      >
        {i18n("wallet.sendBitcoin.payInvoice")}
      </Button>
    </Screen>
  );
};
