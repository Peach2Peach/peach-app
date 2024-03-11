import { useEffect, useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { BTCAmountInput } from "../../components/inputs/BTCAmountInput";
import { Input } from "../../components/inputs/Input";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { useCreateInvoice } from "./hooks/useCreateInvoice";
import { useLightningNodeInfo } from "./hooks/useLightningNodeInfo";
import { MSAT_PER_SAT } from "./hooks/useLightningWalletBalance";

export const ReceiveBitcoinLightning = () => {
  const navigation = useStackNavigation();
  const [amount, setAmount] = useState(0);
  const amountMsat = amount * MSAT_PER_SAT;
  const [description, setDescription] = useState("");
  const { data: lNNodeInfo } = useLightningNodeInfo();
  const { invoice, createInvoice, isCreatingInvoice } = useCreateInvoice({
    amountMsat,
    description,
  });
  const onFocus = () => setAmount(0);

  useEffect(() => {
    if (invoice)
      navigation.navigate("lightningInvoice", {
        invoice,
      });
  }, [invoice, navigation]);

  if (!lNNodeInfo) return <BitcoinLoading text={i18n("wallet.loading")} />;

  return (
    <Screen header={i18n("wallet.receiveBitcoin.title")}>
      <View style={[tw`gap-2 py-1`, tw`md:gap-8 md:py-6`]}>
        <BTCAmountInput
          accessibilityHint={i18n("form.lightningInvoice.amount.label")}
          value={String(amount)}
          onFocus={onFocus}
          onChangeText={(text) => setAmount(Number(text))}
          size="medium"
          textStyle={tw`absolute w-full py-0 opacity-0 grow h-38px input-text`}
          containerStyle={[
            tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
            tw`border bg-primary-background-light border-black-65`,
          ]}
        />
        <Input
          value={description}
          accessibilityHint={i18n("from.description.label")}
          label={i18n("from.description.label")}
          required={false}
          onChangeText={setDescription}
        />
        <Button
          onPress={createInvoice}
          loading={isCreatingInvoice}
          disabled={
            amountMsat === 0 || amountMsat > lNNodeInfo.maxReceivableMsat
          }
        >
          {i18n("wallet.receiveBitcoin.createInvoice")}
        </Button>
      </View>
    </Screen>
  );
};
