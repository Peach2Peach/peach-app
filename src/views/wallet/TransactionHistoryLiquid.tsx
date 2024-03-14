import { useMemo } from "react";
import { FlatList } from "react-native";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { isDefined } from "../../utils/validation/isDefined";
import { EmptyTransactionHistory, TxStatusCard } from "./components";
import { useTxSummariesLiquid } from "./helpers/useTxSummariesLiquid";
import { useSyncLiquidWallet } from "./hooks/useSyncLiquidWallet";

export const TransactionHistoryLiquid = () => {
  const transactionSummaries = useTxSummariesLiquid();

  const transactions = useMemo(
    () =>
      transactionSummaries
        .map((item) => item.data)
        .filter(isDefined)
        .sort((a, b) => (a.date === b.date ? 0 : a.date > b.date ? 1 : -1))
        .reverse(),
    [transactionSummaries],
  );
  const { refetch, isRefetching } = useSyncLiquidWallet();

  console.log(transactions);
  return (
    <Screen header={<TransactionHistoryHeader />}>
      {transactions.length === 0 ? (
        <EmptyTransactionHistory />
      ) : (
        <FlatList
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          contentContainerStyle={[tw`gap-4 py-sm`, tw`md:py-md`]}
          data={transactions}
          renderItem={(props) => <TxStatusCard {...props} />}
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
    navigation.navigate("exportTransactionHistoryLiquid");
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
