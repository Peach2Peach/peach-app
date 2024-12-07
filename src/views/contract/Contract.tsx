import { Screen } from "../../components/Screen";
import tw from "../../styles/tailwind";

import { networks } from "bitcoinjs-lib";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Contract as ContractType } from "../../../peach-api/src/@types/contract";
import { OverlayComponent } from "../../OverlayComponent";
import { Header, HeaderIcon } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { useHandleNotifications } from "../../hooks/notifications/useHandleNotifications";
import { useContractDetail } from "../../hooks/query/useContractDetail";
import { useRoute } from "../../hooks/useRoute";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { HelpPopup } from "../../popups/HelpPopup";
import { ConfirmTradeCancelationPopup } from "../../popups/tradeCancelation/ConfirmTradeCancelationPopup";
import { useAccountStore } from "../../utils/account/account";
import { canCancelContract } from "../../utils/contract/canCancelContract";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getRequiredAction } from "../../utils/contract/getRequiredAction";
import { isPaymentTooLate } from "../../utils/contract/status/isPaymentTooLate";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { generateBlock } from "../../utils/regtest/generateBlock";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { useDecryptedContractData } from "../contractChat/useDecryptedContractData";
import { LoadingScreen } from "../loading/LoadingScreen";
import { TradeComplete } from "../tradeComplete/TradeComplete";
import { ContractActions } from "./ContractActions";
import { PendingPayoutInfo } from "./components/PendingPayoutInfo";
import { TradeInformation } from "./components/TradeInformation";
import { ContractContext, useContractContext } from "./context";

export const Contract = () => {
  const { contractId } = useRoute<"contract">().params;
  const { contract, isLoading, refetch } = useContractDetail(contractId);
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const view = contract
    ? contract.seller.id === publicKey
      ? "seller"
      : "buyer"
    : undefined;

  useHandleNotifications(
    useCallback(
      (message) => {
        if (message.data?.contractId === contractId) refetch();
      },
      [contractId, refetch],
    ),
  );

  if (!contract || !view || isLoading) return <LoadingScreen />;
  if (contract.tradeStatus === "rateUser") {
    return (
      <OverlayComponent>
        <TradeComplete contract={contract} />
      </OverlayComponent>
    );
  }

  return <ContractScreen contract={contract} view={view} />;
};

type ContractScreenProps = {
  contract: ContractType;
  view: "buyer" | "seller";
};

function ContractScreen({ contract, view }: ContractScreenProps) {
  const {
    data,
    isLoading: isLoadingPaymentData,
    isError,
  } = useDecryptedContractData(contract);
  const [showBatchInfo, toggleShowBatchInfo] = useToggleBoolean();

  if (isLoadingPaymentData) return <LoadingScreen />;

  return (
    <ContractContext.Provider
      value={{
        contract,
        paymentData: data?.paymentData,
        isDecryptionError: isError,
        view,
        showBatchInfo,
        toggleShowBatchInfo,
      }}
    >
      <Screen header={<ContractHeader />}>
        <View style={tw`flex-1`}>
          <PeachScrollView
            contentContainerStyle={tw`justify-center grow py-md sm:py-sm`}
          >
            {showBatchInfo ? <PendingPayoutInfo /> : <TradeInformation />}
          </PeachScrollView>
          <ContractActions />
        </View>
      </Screen>
    </ContractContext.Provider>
  );
}

function ContractHeader() {
  const { contract, view } = useContractContext();
  const {
    tradeStatus,
    disputeActive,
    canceled,
    disputeWinner,
    releaseTxId,
    batchInfo,
    amount,
    premium,
  } = contract;
  const requiredAction = getRequiredAction(contract);
  const setPopup = useSetPopup();
  const showConfirmPopup = useCallback(
    () =>
      setPopup(
        <ConfirmTradeCancelationPopup contract={contract} view={view} />,
      ),
    [contract, setPopup, view],
  );
  const showMakePaymentHelp = useCallback(
    () => setPopup(<HelpPopup id="makePayment" />),
    [setPopup],
  );
  const showConfirmPaymentHelp = useCallback(
    () => setPopup(<HelpPopup id="confirmPayment" />),
    [setPopup],
  );

  const memoizedIcons = useMemo(() => {
    const icons: HeaderIcon[] = [];
    if (disputeActive) return icons;

    if (canCancelContract(contract, view))
      icons.push({
        ...headerIcons.cancel,
        onPress: showConfirmPopup,
      });
    if (view === "buyer" && requiredAction === "sendPayment")
      icons.push({
        ...headerIcons.help,
        onPress: showMakePaymentHelp,
      });
    if (view === "seller" && requiredAction === "confirmPayment")
      icons.push({
        ...headerIcons.help,
        onPress: showConfirmPaymentHelp,
      });
    if (getNetwork() === networks.regtest && tradeStatus === "fundEscrow") {
      return [
        { ...headerIcons.generateBlock, onPress: generateBlock },
        ...icons,
      ];
    }
    return icons;
  }, [
    disputeActive,
    contract,
    view,
    showConfirmPopup,
    requiredAction,
    showMakePaymentHelp,
    showConfirmPaymentHelp,
    tradeStatus,
  ]);

  const { paymentMade, paymentExpectedBy } = contract;
  const theme = useMemo(() => {
    if (disputeActive || disputeWinner) return "dispute";
    if (canceled || tradeStatus === "confirmCancelation") return "cancel";
    if (
      isPaymentTooLate({ paymentMade, paymentExpectedBy }) ||
      tradeStatus === "fundingExpired"
    ) {
      return "paymentTooLate";
    }
    return view;
  }, [
    canceled,
    disputeActive,
    disputeWinner,
    paymentExpectedBy,
    paymentMade,
    tradeStatus,
    view,
  ]);

  const title = getHeaderTitle(view, contract);

  const isTradeCompleted =
    releaseTxId ||
    (batchInfo && batchInfo.completed) ||
    tradeStatus === "payoutPending";

  return (
    <Header
      icons={memoizedIcons}
      {...{ title, theme }}
      subtitle={
        <Header.Subtitle
          text={
            isTradeCompleted
              ? view === "buyer"
                ? i18n("contract.bought")
                : i18n("contract.sold")
              : undefined
          }
          viewer={view}
          {...{ amount, premium, theme }}
        />
      }
    />
  );
}

function getHeaderTitle(view: string, contract: ContractType) {
  const {
    tradeStatus,
    disputeWinner,
    canceled,
    disputeActive,
    id: contractId,
  } = contract;
  if (view === "buyer") {
    if (disputeWinner === "buyer") return i18n("contract.disputeWon");
    if (disputeWinner === "seller") return i18n("contract.disputeLost");

    if (tradeStatus === "paymentRequired") {
      const { paymentMade, paymentExpectedBy } = contract;
      if (isPaymentTooLate({ paymentMade, paymentExpectedBy }))
        return i18n("contract.paymentTimerHasRunOut.title");
      return i18n("offer.requiredAction.paymentRequired");
    }
    if (tradeStatus === "confirmPaymentRequired")
      return i18n("offer.requiredAction.waiting.seller");
    if (tradeStatus === "confirmCancelation")
      return i18n("offer.requiredAction.confirmCancelation.buyer");
    if (tradeStatus === "tradeCanceled") return i18n("contract.tradeCanceled");
  }

  if (view === "seller") {
    if (disputeWinner === "seller") return i18n("contract.disputeWon");
    if (disputeWinner === "buyer") return i18n("contract.disputeLost");
    if (canceled) return i18n("contract.tradeCanceled");
  }

  if (disputeActive) return i18n("offer.requiredAction.dispute");
  if (tradeStatus === "fundingExpired") return "not funded on time";
  if (isPaymentTooLate(contract))
    return i18n("contract.paymentTimerHasRunOut.title");

  if (tradeStatus === "confirmCancelation")
    return i18n("offer.requiredAction.confirmCancelation.seller");
  if (tradeStatus === "paymentRequired")
    return i18n("offer.requiredAction.waiting.buyer");
  if (tradeStatus === "confirmPaymentRequired")
    return i18n("offer.requiredAction.confirmPaymentRequired");
  return contractIdToHex(contractId);
}
