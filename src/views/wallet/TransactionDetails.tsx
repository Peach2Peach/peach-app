import { Txid } from "bdk-rn";
import { useMemo } from "react";
import { RefreshControl } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useContractSummaries } from "../../hooks/query/useContractSummaries";
import { useMultipleOfferDetails } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { getTransactionType } from "../../utils/transaction/getTransactionType";
import { isDefined } from "../../utils/validation/isDefined";
import { peachWallet } from "../../utils/wallet/setWallet";
import { useWalletState } from "../../utils/wallet/walletStore";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { TransactionHeader } from "./components/transactionDetails/TransactionHeader";
import { TransactionDetailsInfo } from "./components/transcactionDetails/TransactionDetailsInfo";
import { getOfferData } from "./helpers/getOfferData";
import { getTxSummary } from "./helpers/getTxSummary";
import { useMappedTransactionDetails } from "./hooks/useMappedTransactionDetails";
import { useSyncWallet } from "./hooks/useSyncWallet";

export const TransactionDetails = () => {
  const { txId } = useRoute<"transactionDetails">().params;

  if (!peachWallet || !peachWallet.wallet) throw Error("Peach Wallet not defined");
  const getTxFromStorage = useWalletState((state) => state.getTransaction);
  const txFromLocalStorage = getTxFromStorage(txId)
  if (!txFromLocalStorage) throw Error("TX not found on Local Storage");

  const localTx = peachWallet.wallet.txDetails(Txid.fromString(txId)) ;
  if (!localTx) throw Error("Wrong TX id");
    
    // const localTx = useWalletState((state) => state.getTransaction(txId));
  const { data: transactionDetails } = useMappedTransactionDetails({ localTx });
  const offerIds = useWalletState((state) => state.txOfferMap[txId]);
  const { offers } = useMultipleOfferDetails(offerIds || []);
  const { contracts } = useContractSummaries();

  const transactionSummary = useMemo(() => {
    if (!localTx) return undefined;
    const partialSummary = getTxSummary(txFromLocalStorage);
    const type = getTransactionType(txFromLocalStorage, offers.filter(isDefined)[0]);
    console.log("partialSummary",partialSummary)
    return {
      ...partialSummary,
      id: partialSummary.id,
      type,
      offerData: getOfferData(offers.filter(isDefined), contracts, type),
    };
  }, [localTx, offers, contracts]);

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
