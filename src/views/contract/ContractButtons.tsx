import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
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
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { thousands } from "../../utils/string/thousands";
import { getNavigationDestinationForOffer } from "../yourTrades/utils/navigation/getNavigationDestinationForOffer";
import { useContractContext } from "./context";

export function NewOfferButton() {
  const navigation = useStackNavigation();
  const { contract } = useContractContext();
  const { offer } = useOfferDetail(
    contract ? getOfferIdFromContract(contract) : "",
  );
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

  return (
    <Button onPress={goToNewOffer}>{i18n("contract.goToNewTrade")}</Button>
  );
}

export function PayoutPendingButton() {
  const { showBatchInfo, toggleShowBatchInfo } = useContractContext();

  return (
    <Button style={tw`self-center`} iconId="eye" onPress={toggleShowBatchInfo}>
      {i18n(
        showBatchInfo
          ? "contract.summary.tradeDetails"
          : "offer.requiredAction.payoutPending",
      )}
    </Button>
  );
}
export function ProvideEmailButton() {
  const setPopup = useSetPopup();
  const { contract, view } = useContractContext();
  const onPress = () =>
    setPopup(<DisputeRaisedPopup contract={contract} view={view} />);

  return (
    <Button style={tw`bg-error-main`} onPress={onPress} iconId="alertCircle">
      {i18n("contract.provideEmail")}
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
      title={i18n("dispute.opened")}
      content={
        <View style={tw`gap-4`}>
          <PeachText>
            {i18n(
              `dispute.opened.counterparty.text.1.withEmail.${view}`,
              contractIdToHex(id),
              thousands(amount),
            )}
          </PeachText>

          <PeachText>
            {i18n("dispute.opened.counterparty.text.2.withEmail")}
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
            label={i18n("send")}
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
  const [seenDisputeDisclaimer, setSeenDisputeDisclaimer] = useConfigStore(
    useShallow((state) => [
      state.seenDisputeDisclaimer,
      state.setSeenDisputeDisclaimer,
    ]),
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
        ? i18n("chat")
        : `${unreadMessages} ${i18n("contract.unread")}`}
    </Button>
  );
}

function DisputeDisclaimerPopup() {
  return (
    <InfoPopup
      title={i18n("trade.chat")}
      content={
        <PeachText style={tw`text-black-100`}>
          {i18n("chat.disputeDisclaimer.1")}
          {"\n\n"}
          {i18n("chat.disputeDisclaimer.2")}

          <PeachText style={tw`underline text-black-100`}>
            {i18n("chat.disputeDisclaimer.3")}
          </PeachText>

          {i18n("chat.disputeDisclaimer.4")}
          {"\n\n"}
          {i18n("chat.disputeDisclaimer.5")}
        </PeachText>
      }
    />
  );
}
