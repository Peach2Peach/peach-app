import {
  listPayments,
  Payment,
  PaymentType,
} from "@breeztech/react-native-breez-sdk";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { BitcoinAmountInfo } from "../../components/statusCard/BitcoinAmountInfo";
import { StatusCard } from "../../components/statusCard/StatusCard";
import { statusCardStyles } from "../../components/statusCard/statusCardStyles";
import { StatusInfo } from "../../components/statusCard/StatusInfo";
import tw from "../../styles/tailwind";
import { getShortDateFormat } from "../../utils/date/getShortDateFormat";
import i18n from "../../utils/i18n";
import { EmptyTransactionHistory } from "./components";
import { TxIcon } from "./components/TransactionIcon";
import { MSAT_PER_SAT } from "./hooks/useLightningWalletBalance";

const useLightningPayments = () =>
  useQuery({
    queryKey: ["wallet", "lightning", "payments"],
    queryFn: () => listPayments({}),
    initialData: [],
  });

const levelMap: Record<PaymentType, keyof typeof statusCardStyles.bg> = {
  sent: "primary",
  received: "success",
  closedChannel: "warning",
};
const iconMap: Record<PaymentType, TxIcon> = {
  sent: { id: "arrowUpCircle", color: tw.color("primary-main") },
  received: { id: "arrowDownCircle", color: tw.color("success-main") },
  closedChannel: { id: "rotateCounterClockwise", color: tw.color("black-50") },
};

const LightningPayment = ({ payment }: { payment: Payment }) => (
  <StatusCard
    onPress={() => {}}
    color={levelMap[payment.paymentType]}
    statusInfo={
      <StatusInfo
        title={payment.paymentType}
        icon={
          <Icon
            size={17}
            id={iconMap[payment.paymentType].id}
            color={iconMap[payment.paymentType].color}
          />
        }
        subtext={getShortDateFormat(new Date(payment.paymentTime))}
      />
    }
    amountInfo={
      <BitcoinAmountInfo amount={payment.amountMsat / MSAT_PER_SAT} />
    }
  />
);
export const LightningTransactionHistory = () => {
  const {
    data: lightningPayments,
    refetch,
    isRefetching,
  } = useLightningPayments();

  return (
    <Screen header={<TransactionHistoryHeader />}>
      {lightningPayments.length === 0 ? (
        <EmptyTransactionHistory />
      ) : (
        <FlatList
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          contentContainerStyle={[tw`gap-4 py-sm`, tw`md:py-md`]}
          data={lightningPayments}
          renderItem={({ item: payment }) => (
            <LightningPayment {...{ payment }} />
          )}
          keyExtractor={(item) => item.id}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
        />
      )}
    </Screen>
  );
};

function TransactionHistoryHeader() {
  return <Header title={i18n("wallet.transactionHistory")} />;
}
