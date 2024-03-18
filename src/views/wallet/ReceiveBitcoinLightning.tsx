import { useEffect, useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { BTCAmountInput } from "../../components/inputs/BTCAmountInput";
import { Dropdown } from "../../components/inputs/Dropdown";
import { Input } from "../../components/inputs/Input";
import { NumberInput } from "../../components/inputs/NumberInput";
import { PeachText } from "../../components/text/PeachText";
import { SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CURRENCIES } from "../../paymentMethods";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { useCreateInvoice } from "./hooks/useCreateInvoice";
import { useLightningNodeInfo } from "./hooks/useLightningNodeInfo";
import { MSAT_PER_SAT } from "./hooks/useLightningWalletBalance";

export const ReceiveBitcoinLightning = () => {
  const navigation = useStackNavigation();
  const [amount, setAmount] = useState(0);
  const { data: prices = {} } = useMarketPrices();
  const displayCurrency = useSettingsStore((state) => state.displayCurrency);
  const [currency, setCurreny] = useState(displayCurrency);

  const price = prices[currency] || 0;
  const [fiat, setFiat] = useState("0");
  const amountMsat = amount * MSAT_PER_SAT;
  const [description, setDescription] = useState("");
  const { data: lNNodeInfo } = useLightningNodeInfo();
  const { invoice, createInvoice, isCreatingInvoice } = useCreateInvoice({
    amountMsat,
    description,
  });
  const onFocus = () => setAmount(0);

  const updateAmount = (value: number) => {
    setAmount(value);
    setFiat(round(((price || 0) / SATSINBTC) * value, 2).toFixed(2));
  };
  const updateFiat = (value: string) => {
    setAmount(round((Number(value) / price) * SATSINBTC));
    setFiat(value);
  };
  const updateCurrency = (value: Currency) => {
    const newPrice = prices[value] || 0;
    setCurreny(value);
    setAmount(round((Number(fiat) / newPrice) * SATSINBTC));
  };
  useEffect(() => {
    if (invoice)
      navigation.replace("lightningInvoice", {
        invoice,
      });
  }, [invoice, navigation]);

  if (!lNNodeInfo) return <BitcoinLoading text={i18n("wallet.loading")} />;

  return (
    <Screen
      style={tw`justify-between`}
      header={i18n("wallet.receiveBitcoin.title")}
    >
      <View style={tw`gap-6 py-6`}>
        <Input
          value={description}
          placeholder={i18n("label")}
          required={false}
          onChangeText={setDescription}
        />
        <View style={tw`gap-2`}>
          <PeachText style={tw`pl-2 input-title`}>
            {i18n("form.lightningInvoice.amount.label")}
          </PeachText>
          <BTCAmountInput
            accessibilityHint={i18n("form.lightningInvoice.amount.label")}
            value={String(amount)}
            onFocus={onFocus}
            onChangeText={(text) => updateAmount(Number(text))}
            size="large"
            textStyle={tw`absolute w-full py-0 opacity-0 grow h-38px input-text`}
            containerStyle={[
              tw`self-stretch justify-center items-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
              tw`border bg-primary-background-light border-black-65`,
            ]}
          />
          <View style={tw`flex-row gap-2`}>
            <View style={tw`flex-shrink`}>
              <NumberInput
                accessibilityHint={i18n("form.lightningInvoice.fiat.label")}
                decimals={2}
                value={fiat}
                onChangeText={updateFiat}
              />
            </View>
            <Dropdown
              value={currency}
              onChange={updateCurrency}
              options={CURRENCIES}
            />
          </View>
        </View>
      </View>
      <Button
        style={tw`bg-success-main`}
        onPress={createInvoice}
        loading={isCreatingInvoice}
        disabled={amountMsat === 0 || amountMsat > lNNodeInfo.maxReceivableMsat}
      >
        {i18n("wallet.receiveBitcoin.createInvoice")}
      </Button>
    </Screen>
  );
};
