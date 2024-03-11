import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import { View } from "react-native";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { LightningInvoice } from "../../components/bitcoin/LightningInvoice";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { useLightningPayment } from "./hooks/useLightningPayment";

export const LightningInvoiceScreen = () => {
  const { invoice } = useRoute<"lightningInvoice">().params;
  const { data: lightningPayment } = useLightningPayment({ invoice });
  const status = lightningPayment?.status || PaymentStatus.PENDING;

  return (
    <Screen header={i18n("wallet.invoice.title")}>
      <View style={tw`items-center justify-center flex-1 gap-8`}>
        {status === PaymentStatus.PENDING && (
          <LightningInvoice invoice={invoice} />
        )}
        {status === PaymentStatus.COMPLETE && (
          <Icon id="checkCircle" color={tw.color("success-main")} size={32} />
        )}
        {status === PaymentStatus.FAILED && (
          <Icon id="xCircle" color={tw.color("error-main")} size={32} />
        )}
      </View>
    </Screen>
  );
};
