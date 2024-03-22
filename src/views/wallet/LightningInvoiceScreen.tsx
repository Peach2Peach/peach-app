import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { useMemo } from "react";
import { View } from "react-native";
import { Divider } from "../../components/Divider";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { Screen } from "../../components/Screen";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { PeachText } from "../../components/text/PeachText";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { LightningInvoice } from "./components/LightningInvoice";
import { useLightningPayment } from "./hooks/useLightningPayment";

export const LightningInvoiceScreen = () => {
  const { invoice } = useRoute<"lightningInvoice">().params;
  const { data: lightningPayment } = useLightningPayment({ invoice });
  const status = lightningPayment?.status || PaymentStatus.PENDING;
  const paymentRequest = useMemo(() => bolt11.decode(invoice), [invoice]);
  return (
    <Screen header={i18n("wallet.receiveBitcoinLightning.title")}>
      <View style={tw`items-center justify-center flex-1 gap-8`}>
        <PeachText>{paymentRequest.tagsObject.description}</PeachText>
        <Divider />
        <LightningInvoice invoice={invoice} />
        {status === PaymentStatus.PENDING && (
          <TradeInfo
            text={i18n("wallet.invoice.checkingInvoiceStatus")}
            IconComponent={<Loading style={tw`w-4 h-4`} />}
          />
        )}
        {status === PaymentStatus.COMPLETE && (
          <TradeInfo
            text={i18n("wallet.invoice.invoicePaid")}
            IconComponent={
              <Icon
                id="checkCircle"
                color={tw.color("success-main")}
                size={16}
              />
            }
          />
        )}
        {status === PaymentStatus.FAILED && (
          <TradeInfo
            text={i18n("wallet.invoice.invoiceNotPaid")}
            IconComponent={
              <Icon id="xCircle" color={tw.color("error-main")} size={16} />
            }
          />
        )}
      </View>
    </Screen>
  );
};
