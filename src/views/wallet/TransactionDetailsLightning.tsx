import {
  Payment,
  PaymentStatus,
  PaymentType,
} from "@breeztech/react-native-breez-sdk";
import { View } from "react-native";
import { Divider } from "../../components/Divider";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { AmountSummaryItem } from "../../components/summaryItem";
import { ConfirmationSummaryItem } from "../../components/summaryItem/ConfirmationSummaryItem";
import { CopyableSummaryItem } from "../../components/summaryItem/CopyableSummaryItem";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { MSINASECOND } from "../../constants";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import { toShortDateFormat } from "../../utils/date/toShortDateFormat";
import i18n from "../../utils/i18n";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TransactionHeader } from "./components/transactionDetails/TransactionHeader";
import { useLightningPayment } from "./hooks/useLightningPayment";
import { MSAT_PER_SAT } from "./hooks/useLightningWalletBalance";

type Props = {
  transactionDetails: Payment;
  transactionSummary: TransactionSummary;
};

export const TransactionDetailsInfoLightning = ({
  transactionDetails,
  transactionSummary,
}: Props) => (
  <View style={tw`gap-4`}>
    {!!transactionDetails.description && (
      <CopyableSummaryItem
        title={i18n("label")}
        text={transactionDetails.description}
      />
    )}
    <AmountSummaryItem amount={transactionSummary.amount} />

    <Divider />

    <ConfirmationSummaryItem
      confirmed={transactionDetails.status === PaymentStatus.COMPLETE}
      failed={
        !!transactionDetails.error ||
        transactionDetails.status === PaymentStatus.FAILED
      }
    />
    {transactionDetails.error && (
      <ErrorBox>{transactionDetails.error}</ErrorBox>
    )}
    <CopyableSummaryItem
      title={i18n("time")}
      text={toShortDateFormat(transactionSummary.date, true)}
    />
  </View>
);
const summaryTypeMap: Record<PaymentType, TransactionType> = {
  sent: "WITHDRAWAL",
  received: "DEPOSIT",
  closedChannel: "REFUND",
};
const mapLNPaymentToTransactionSummary = (
  payment: Payment,
): TransactionSummary => ({
  type: summaryTypeMap[payment.paymentType],
  id: payment.id,
  chain: "lightning",
  offerData: [],
  amount: payment.amountMsat / MSAT_PER_SAT,
  date: new Date(payment.paymentTime * MSINASECOND),
  confirmed: true,
});

export const TransactionDetailsLightning = () => {
  const { invoice } = useRoute<"transactionDetailsLightning">().params;
  const { data: transactionDetails } = useLightningPayment({ invoice });

  if (!transactionDetails) return <BitcoinLoading />;

  const transactionSummary =
    mapLNPaymentToTransactionSummary(transactionDetails);
  return (
    <Screen header={i18n("wallet.transactionDetails")}>
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`gap-8`}
      >
        <TransactionHeader style={tw`self-center`} {...transactionSummary} />
        <TransactionDetailsInfoLightning
          {...{ transactionDetails, transactionSummary }}
        />
      </PeachScrollView>
    </Screen>
  );
};
