import { useQuery } from "@tanstack/react-query";
import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { RefreshControl } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useContractSummaries } from "../../hooks/query/useContractSummaries";
import { useMultipleOfferDetails } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { getTxHex } from "../../utils/liquid/getTxHex";
import { isDefined } from "../../utils/validation/isDefined";
import { useLiquidWalletState } from "../../utils/wallet/useLiquidWalletState";
import { useWalletState } from "../../utils/wallet/walletStore";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TransactionHeader } from "./components/transactionDetails/TransactionHeader";
import { TransactionDetailsInfo } from "./components/transcactionDetails/TransactionDetailsInfo";
import { getOfferData } from "./helpers/getOfferData";
import { getTxSummaryLiquid } from "./helpers/useTxSummariesLiquid";
import { useSyncWallet } from "./hooks/useSyncWallet";

const useTransactionDetailsLiquid = ({ txId }: { txId: string }) =>
  useQuery({
    queryKey: ["electrs", "liquid", "transaction", "hex"],
    queryFn: async () => {
      const result = await getTxHex({ txId });
      if (!result.result) throw Error("NETWORK_ERROR");
      return LiquidTransaction.fromHex(result.result);
    },
  });

export const TransactionDetailsLiquid = () => {
  const { txId } = useRoute<"transactionDetailsLiquid">().params;
  const localTx = useLiquidWalletState((state) =>
    state.transactions.find((tx) => tx.txid === txId),
  );
  const { data: transactionDetails } = useTransactionDetailsLiquid({ txId });
  const offerIds = useWalletState((state) => state.txOfferMap[txId]);
  const map = useBoltzSwapStore((state) => state.map);

  const { offers } = useMultipleOfferDetails(offerIds || []);
  const { contracts } = useContractSummaries();
  const partialSummary = localTx
    ? getTxSummaryLiquid({
        tx: localTx,
        offer: offers.filter(isDefined)[0],
        swapId: map[txId]?.[0],
      })
    : undefined;

  const transactionSummary = partialSummary
    ? {
        ...partialSummary,
        offerData: getOfferData(
          offers.filter(isDefined),
          contracts,
          partialSummary.type,
        ),
      }
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
