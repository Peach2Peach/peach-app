import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { LightningInvoice } from "../../components/bitcoin/LightningInvoice";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export const LightningInvoiceScreen = () => {
  const { invoice } = useRoute<"lightningInvoice">().params;

  return (
    <Screen header={i18n("wallet.invoice.title")}>
      <View style={tw`items-center justify-center flex-1 gap-8`}>
        <LightningInvoice invoice={invoice} />
      </View>
    </Screen>
  );
};
