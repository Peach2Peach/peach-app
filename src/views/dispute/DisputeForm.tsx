import { useMemo, useRef } from "react";
import { Keyboard, TextInput, View } from "react-native";
import tw from "../../styles/tailwind";

import { useTranslate } from "@tolgee/react";
import { Contract } from "../../../peach-api/src/@types/contract";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { EmailInput } from "../../components/inputs/EmailInput";
import { Input } from "../../components/inputs/Input";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { useContractDetail } from "../../hooks/query/useContractDetail";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useValidatedState } from "../../hooks/useValidatedState";
import { DisputeRaisedSuccess } from "../../popups/dispute/DisputeRaisedSuccess";
import { useAccountStore } from "../../utils/account/account";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getContractViewer } from "../../utils/contract/getContractViewer";
import { isEmailRequiredForDispute } from "../../utils/dispute/isEmailRequiredForDispute";
import { LoadingScreen } from "../loading/LoadingScreen";
import { useRaiseDispute } from "./useRaiseDispute";

export const DisputeForm = () => {
  const { contractId } = useRoute<"disputeForm">().params;
  const { contract } = useContractDetail(contractId);

  return !contract ? (
    <LoadingScreen />
  ) : (
    <DisputeFormScreen contract={contract} />
  );
};

const required = { required: true };
function DisputeFormScreen({ contract }: { contract: Contract }) {
  const navigation = useStackNavigation();
  const { reason, contractId } = useRoute<"disputeForm">().params;

  const emailRules = useMemo(
    () => ({
      email: isEmailRequiredForDispute(reason),
      required: isEmailRequiredForDispute(reason),
    }),
    [reason],
  );
  const [email, setEmail, emailIsValid, emailErrors] =
    useValidatedState<string>("", emailRules);
  const [message, setMessage, messageIsValid, messageErrors] =
    useValidatedState<string>("", required);
  const isFormValid = emailIsValid && messageIsValid;

  const publicKey = useAccountStore((state) => state.account.publicKey);

  const setPopup = useSetPopup();
  const showErrorBanner = useShowErrorBanner();

  const { mutate: raiseDispute, isPending } = useRaiseDispute(contract);

  const { t } = useTranslate("form");

  const submit = () => {
    Keyboard.dismiss();

    if (!isFormValid) return;

    raiseDispute(
      { reason, email, message },
      {
        onSuccess: () => {
          navigation.navigate("contractChat", { contractId });
          setPopup(
            <DisputeRaisedSuccess
              view={getContractViewer(contract.seller.id, publicKey)}
            />,
          );
        },
        onError: (error) => {
          showErrorBanner(error.message);
        },
      },
    );
  };

  let $message = useRef<TextInput>(null).current;
  return (
    <Screen
      header={t("dispute.disputeForTrade", {
        ns: "contract",
        tradeId: contractIdToHex(contractId),
      })}
    >
      <PeachScrollView
        contentContainerStyle={tw`items-center justify-center grow`}
      >
        <View style={tw`justify-center h-full max-w-full`}>
          <EmailInput
            onChangeText={setEmail}
            onSubmitEditing={() => $message?.focus()}
            value={email}
            placeholder={t("form.userEmail.placeholder")}
            errorMessage={emailErrors}
          />
          <Input
            value={t(`dispute.reason.${reason}`, { ns: "contract" })}
            disabled
          />
          <Input
            style={tw`h-40`}
            reference={(el) => ($message = el)}
            onChangeText={setMessage}
            value={message}
            multiline={true}
            placeholder={t("form.message.placeholder")}
            errorMessage={messageErrors}
          />
        </View>
      </PeachScrollView>
      <Button
        onPress={submit}
        disabled={isPending || !isFormValid}
        style={tw`self-center`}
      >
        {t("confirm", { ns: "global" })}
      </Button>
    </Screen>
  );
}
