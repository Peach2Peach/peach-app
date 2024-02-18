import { RefreshControl } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useMultipleOfferDetails } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { isDefined } from "../../utils/validation/isDefined";
import { useWalletState } from "../../utils/wallet/walletStore";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TransactionHeader } from "./components/transactionDetails/TransactionHeader";
import { TransactionDetailsInfo } from "./components/transcactionDetails/TransactionDetailsInfo";
import { getTxSummary } from "./helpers/getTxSummary";
import { useMappedTransactionDetails } from "./hooks/useMappedTransactionDetails";
import { useSyncWallet } from "./hooks/useSyncWallet";

export const TransactionDetails = () => {
  const { txId } = useRoute<"transactionDetails">().params;
  const localTx = useWalletState((state) => state.getTransaction(txId));
  const { data: transactionDetails } = useMappedTransactionDetails({ localTx });
  const offerIds = useWalletState((state) => state.txOfferMap[txId]);
  const { offers } = useMultipleOfferDetails(offerIds);
  const transactionSummary = localTx
    ? getTxSummary({
        tx: localTx,
        offers: offers.filter(isDefined),
      })
    : undefined;
  const { refetch: refresh, isRefetching } = useSyncWallet();

  if (!localTx || !transactionDetails || !transactionSummary)
    return <BitcoinLoading />;

  return (
    <Screen header={i18n("wallet.transactionDetails")}>
      <PeachScrollView
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`gap-8`}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refresh()}
          />
        }
      >
        <TransactionHeader style={tw`self-center`} {...transactionSummary} />
        <TransactionDetailsInfo
          {...{ localTx, transactionDetails, transactionSummary }}
        />
      </PeachScrollView>
    </Screen>
  );
};
