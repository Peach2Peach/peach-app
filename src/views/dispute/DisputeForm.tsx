import { useMemo, useRef } from "react";
import { Keyboard, TextInput, View } from "react-native";
import tw from "../../styles/tailwind";

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
import { isEmailRequiredForDispute } from "../../utils/dispute/isEmailRequiredForDispute";
import i18n from "../../utils/i18n";
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
              view={contract.seller.id === publicKey ? "seller" : "buyer"}
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
      header={i18n("dispute.disputeForTrade", contractIdToHex(contractId))}
    >
      <PeachScrollView
        contentContainerStyle={tw`items-center justify-center grow`}
      >
        <View style={tw`justify-center h-full max-w-full`}>
          <EmailInput
            onChangeText={setEmail}
            onSubmitEditing={() => $message?.focus()}
            value={email}
            placeholder={i18n("form.userEmail.placeholder")}
            errorMessage={emailErrors}
          />
          <Input value={i18n(`dispute.reason.${reason}`)} disabled />
          <Input
            style={tw`h-40`}
            reference={(el) => ($message = el)}
            onChangeText={setMessage}
            value={message}
            multiline={true}
            placeholder={i18n("form.message.placeholder")}
            errorMessage={messageErrors}
          />
        </View>
      </PeachScrollView>
      <Button
        onPress={submit}
        disabled={isPending || !isFormValid}
        style={tw`self-center`}
      >
        {i18n("confirm")}
      </Button>
    </Screen>
  );
}
