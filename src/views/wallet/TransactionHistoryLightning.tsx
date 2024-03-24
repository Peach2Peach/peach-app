import { Payment, PaymentType } from "@breeztech/react-native-breez-sdk";
import { FlatList } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { BitcoinAmountInfo } from "../../components/statusCard/BitcoinAmountInfo";
import { StatusCard } from "../../components/statusCard/StatusCard";
import { StatusInfo } from "../../components/statusCard/StatusInfo";
import { statusCardStyles } from "../../components/statusCard/statusCardStyles";
import { MSINASECOND } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { getShortDateFormat } from "../../utils/date/getShortDateFormat";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { EmptyTransactionHistory } from "./components";
import { TxIcon } from "./components/TransactionIcon";
import { useLightningPayments } from "./hooks/useLightningPayments";
import { MSAT_PER_SAT } from "./hooks/useLightningWalletBalance";

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

const LightningPayment = ({ payment }: { payment: Payment }) => {
  const navigation = useStackNavigation();
  return (
    <StatusCard
      onPress={() =>
        "bolt11" in payment.details.data &&
        navigation.navigate("transactionDetailsLightning", {
          invoice: payment.details.data.bolt11,
        })
      }
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
          subtext={getShortDateFormat(
            new Date(payment.paymentTime * MSINASECOND),
          )}
        />
      }
      amountInfo={
        <BitcoinAmountInfo
          chain="lightning"
          amount={payment.amountMsat / MSAT_PER_SAT}
        />
      }
    />
  );
};
export const TransactionHistoryLightning = () => {
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
  const navigation = useStackNavigation();
  const onPress = () => {
    navigation.navigate("exportTransactionHistory", { chain: "lightning" });
  };
  return (
    <Header
      title={i18n("wallet.transactionHistory")}
      icons={[
        {
          ...headerIcons.share,
          onPress,
          accessibilityHint: `${i18n("goTo")} ${i18n("wallet.exportHistory.title")}`,
        },
      ]}
    />
  );
}
