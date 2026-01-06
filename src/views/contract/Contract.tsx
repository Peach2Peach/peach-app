import { Screen } from "../../components/Screen";
import tw from "../../styles/tailwind";

import { useCallback, useMemo } from "react";
import { OverlayComponent } from "../../OverlayComponent";
import { Header, HeaderIcon } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { useHandleNotifications } from "../../hooks/notifications/useHandleNotifications";
import { useContractDetail } from "../../hooks/query/useContractDetail";
import { useFundingStatus } from "../../hooks/query/useFundingStatus";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { HelpPopup } from "../../popups/HelpPopup";
import { ConfirmTradeCancelationPopup } from "../../popups/tradeCancelation/ConfirmTradeCancelationPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../utils/account/account";
import { canCancelContract } from "../../utils/contract/canCancelContract";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getRequiredAction } from "../../utils/contract/getRequiredAction";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { isPaymentTooLate } from "../../utils/contract/status/isPaymentTooLate";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
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
      async (message) => {
        if (message.data?.contractId === contractId) await refetch();
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
  contract: Contract;
  view: "buyer" | "seller";
};

function ContractScreen({ contract, view }: ContractScreenProps) {
  const {
    data,
    isLoading: isLoadingPaymentData,
    isError,
  } = useDecryptedContractData(contract);
  const [showBatchInfo, toggleShowBatchInfo] = useToggleBoolean();

  const { user: selfUser } = useSelfUser();
  const setPopup = useSetPopup();
  const hasSeenFirstTimeBuyerPopup = useSettingsStore(
    (state) => state.seenFirstTimeBuyerPopup,
  );
  const setSeenFirstTimeBuyerPopup = useSettingsStore(
    (state) => state.setSeenFirstTimeBuyerPopup,
  );

  const hasSeenFirstTimeSellerPopup = useSettingsStore(
    (state) => state.seenFirstTimeSellerPopup,
  );
  const setSeenFirstTimeSellerPopup = useSettingsStore(
    (state) => state.setSeenFirstTimeSellerPopup,
  );

  if (isLoadingPaymentData) return <LoadingScreen />;
  if (
    selfUser &&
    contract.tradeStatus === "paymentRequired" &&
    !hasSeenFirstTimeBuyerPopup &&
    selfUser.id === contract.buyer.id
  ) {
    setPopup(<HelpPopup id="firstTimeBuyer" />);
    setSeenFirstTimeBuyerPopup();
  }
  if (
    selfUser &&
    contract.tradeStatus === "confirmPaymentRequired" &&
    !hasSeenFirstTimeSellerPopup &&
    selfUser.id === contract.seller.id
  ) {
    setPopup(<HelpPopup id="firstTimeSeller" />);
    setSeenFirstTimeSellerPopup();
  }
  return (
    <ContractContext.Provider
      value={{
        contract,
        paymentData: data?.paymentData,
        buyerPaymentData: data?.buyerPaymentData,
        isDecryptionError: isError,
        view,
        showBatchInfo,
        toggleShowBatchInfo,
      }}
    >
      <Screen header={<ContractHeader />}>
        <PeachScrollView
          contentContainerStyle={tw`grow`}
          contentStyle={tw`grow`}
        >
          {showBatchInfo ? <PendingPayoutInfo /> : <TradeInformation />}
          <ContractActions />
        </PeachScrollView>
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
  const sellOfferId = getSellOfferIdFromContract(contract);
  const { fundingStatus } = useFundingStatus(sellOfferId, view === "seller");
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

    if (canCancelContract(contract, view, fundingStatus))
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
    return icons;
  }, [
    disputeActive,
    contract,
    view,
    requiredAction,
    showMakePaymentHelp,
    showConfirmPaymentHelp,
    disputeActive,
    showConfirmPopup,
    fundingStatus,
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

function getHeaderTitle(view: string, contract: Contract) {
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
  if (tradeStatus === "fundingExpired")
    return i18n("offer.requiredAction.fundingExpired");
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
