import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Button } from "../../components/buttons/Button";
import { EmailInput } from "../../components/inputs/EmailInput";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../../components/popup/actions/LoadingPopupAction";
import { PeachText } from "../../components/text/PeachText";
import { contractKeys } from "../../hooks/query/useContractDetail";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useValidatedState } from "../../hooks/useValidatedState";
import { ErrorPopup } from "../../popups/ErrorPopup";
import { InfoPopup } from "../../popups/InfoPopup";
import { useSubmitDisputeAcknowledgement } from "../../popups/dispute/useSubmitDisputeAcknowledgement";
import { useConfigStore } from "../../store/configStore/configStore";
import tw from "../../styles/tailwind";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getOfferIdFromContract } from "../../utils/contract/getOfferIdFromContract";
import { peachAPI } from "../../utils/peachAPI";
import { thousands } from "../../utils/string/thousands";
import { getNavigationDestinationForOffer } from "../yourTrades/utils/navigation/getNavigationDestinationForOffer";
import { useContractContext } from "./context";
import { useTranslate } from "@tolgee/react";

export function NewOfferButton() {
  const navigation = useStackNavigation();
  const { contract } = useContractContext();
  const { offer } = useOfferDetail(
    contract ? getOfferIdFromContract(contract) : "",
  );
  const { t } = useTranslate("contract");
  const newOfferId =
    !!offer && "newOfferId" in offer ? offer?.newOfferId : undefined;
  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return;
    const { result: newOffer } = await peachAPI.private.offer.getOfferDetails({
      offerId: newOfferId,
    });
    if (!newOffer) return;
    if (newOffer?.contractId) {
      navigation.replace("contract", { contractId: newOffer?.contractId });
    } else {
      const [screen, params] = getNavigationDestinationForOffer(newOffer);
      navigation.replace(screen, params);
    }
  }, [newOfferId, navigation]);

  return <Button onPress={goToNewOffer}>{t("contract.goToNewTrade")}</Button>;
}

export function PayoutPendingButton() {
  const { showBatchInfo, toggleShowBatchInfo } = useContractContext();
  const { t } = useTranslate("contract");

  return (
    <Button style={tw`self-center`} iconId="eye" onPress={toggleShowBatchInfo}>
      {t(
        showBatchInfo
          ? "contract.summary.tradeDetails"
          : "offer.requiredAction.payoutPending",
        { ns: "batching" },
      )}
    </Button>
  );
}
export function ProvideEmailButton() {
  const setPopup = useSetPopup();
  const { contract, view } = useContractContext();
  const { t } = useTranslate("contract");
  const onPress = () =>
    setPopup(<DisputeRaisedPopup contract={contract} view={view} />);

  return (
    <Button style={tw`bg-error-main`} onPress={onPress} iconId="alertCircle">
      {t("contract.provideEmail")}
    </Button>
  );
}
const emailRules = { required: true, email: true };
function DisputeRaisedPopup({
  contract,
  view,
}: {
  contract: Contract;
  view: ContractViewer;
}) {
  const { t } = useTranslate();
  const { id, disputeReason, amount } = contract;
  const submitDisputeAcknowledgement = useSubmitDisputeAcknowledgement();
  const [email, setEmail, , emailErrors] = useValidatedState<string>(
    "",
    emailRules,
  );
  const submit = () => {
    submitDisputeAcknowledgement({
      contractId: id,
      disputeReason: disputeReason || "other",
      email,
    });
  };
  return (
    <ErrorPopup
      title={t("dispute.opened", { ns: "contract" })}
      content={
        <View style={tw`gap-4`}>
          <PeachText>
            {t(`dispute.opened.counterparty.text.1.withEmail.${view}`, {
              ns: "contract",
              contractHexId: contractIdToHex(id),
              disputeAmount: thousands(amount),
            })}
          </PeachText>

          <PeachText>
            {t("dispute.opened.counterparty.text.2.withEmail", {
              ns: "contract",
            })}
          </PeachText>

          <View>
            <EmailInput
              style={tw`bg-error-background`}
              onChangeText={setEmail}
              onSubmitEditing={submit}
              value={email}
              errorMessage={emailErrors}
            />
          </View>
        </View>
      }
      actions={
        <>
          <ClosePopupAction />
          <LoadingPopupAction
            label={t("send")}
            iconId="arrowRightCircle"
            disabled={emailErrors.length > 0}
            onPress={submit}
            reverseOrder
          />
        </>
      }
    />
  );
}

export function ChatButton() {
  const {
    contract: { unreadMessages, id },
  } = useContractContext();
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const showHelp = useCallback(
    () => setPopup(<DisputeDisclaimerPopup />),
    [setPopup],
  );
  const { t } = useTranslate("chat");
  const [seenDisputeDisclaimer, setSeenDisputeDisclaimer] = useConfigStore(
    (state) => [state.seenDisputeDisclaimer, state.setSeenDisputeDisclaimer],
    shallow,
  );
  const { contractId } = useRoute<"contract">().params;
  const queryClient = useQueryClient();
  const goToChat = () => {
    queryClient.setQueryData(
      contractKeys.detail(contractId),
      (oldQueryData: Contract | undefined) => {
        if (!oldQueryData) return oldQueryData;
        return {
          ...oldQueryData,
          unreadMessages: 0,
        };
      },
    );
    navigation.push("contractChat", { contractId: id });
    if (!seenDisputeDisclaimer) {
      showHelp();
      setSeenDisputeDisclaimer(true);
    }
  };
  return (
    <Button
      style={tw`flex-1`}
      iconId={unreadMessages === 0 ? "messageCircle" : "messageFull"}
      onPress={goToChat}
    >
      {unreadMessages === 0
        ? t("chat")
        : `${unreadMessages} ${t({ key: "contract.unread", ns: "contract" })}`}
    </Button>
  );
}

function DisputeDisclaimerPopup() {
  const { t } = useTranslate("chat");
  return (
    <InfoPopup
      title={t("trade.chat")}
      content={
        <PeachText>
          {t("chat.disputeDisclaimer.1")}
          {"\n\n"}
          {t("chat.disputeDisclaimer.2")}

          <PeachText style={tw`underline`}>
            {t("chat.disputeDisclaimer.3")}
          </PeachText>

          {t("chat.disputeDisclaimer.4")}
          {"\n\n"}
          {t("chat.disputeDisclaimer.5")}
        </PeachText>
      }
    />
  );
}
