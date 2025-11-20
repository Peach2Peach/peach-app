import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { Checkbox } from "../../components/inputs/Checkbox";
import { EmailInput } from "../../components/inputs/EmailInput";
import { Input } from "../../components/inputs/Input";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useValidatedState } from "../../hooks/useValidatedState";
import { AppPopup } from "../../popups/AppPopup";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import i18n from "../../utils/i18n";
import { useSendReport } from "./useSendReport";

const emailRules = { email: true, required: true };
const required = { required: true };

export const Report = () => {
  const route = useRoute<"report">();
  const { errorMessage } = route.params;
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const [email, setEmail, isEmailValid, emailErrors] =
    useValidatedState<string>("", emailRules);

  const [sendErrorLogs, setSendErrorLogs] = useState(true);

  const [topic, setTopic, isTopicValid, topicErrors] = useValidatedState(
    route.params.topic || "",
    required,
  );
  const [message, setMessage, isMessageValid, messageErrors] =
    useValidatedState(route.params.message || "", required);
  const reason = route.params.reason;
  const publicKey = useAccountStore((state) => state.account.publicKey);

  const showError = useShowErrorBanner();

  const { mutate: submitReport } = useSendReport();

  const submit = () => {
    const isFormValid = isEmailValid && isTopicValid && isMessageValid;
    if (!isFormValid) return;

    submitReport(
      {
        email,
        reason: i18n(`contact.reason.${reason}`),
        topic,
        message,
        errorLogs: sendErrorLogs ? errorMessage : undefined,
      },
      {
        onError: (err) => showError(err.message),
        onSuccess: () => {
          if (publicKey) {
            navigation.navigate("homeScreen", { screen: "settings" });
          } else {
            navigation.navigate("welcome");
          }
          setPopup(<AppPopup id="reportSuccess" />);
        },
      },
    );
  };

  let $topic = useRef<TextInput>(null).current;
  let $message = useRef<TextInput>(null).current;

  return (
    <Screen header={i18n("contact.title")}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <EmailInput
          onChangeText={setEmail}
          onSubmitEditing={() => $topic?.focus()}
          value={email}
          placeholder={i18n("form.userEmail.placeholder")}
          errorMessage={emailErrors}
        />
        <Input
          onChangeText={setTopic}
          onSubmitEditing={() => $message?.focus()}
          reference={(el) => ($topic = el)}
          value={topic}
          placeholder={i18n("form.topic.placeholder")}
          errorMessage={topicErrors}
        />
        <Input
          style={tw`h-40`}
          onChangeText={setMessage}
          reference={(el) => ($message = el)}
          value={message}
          multiline={true}
          placeholder={i18n("form.message.placeholder")}
          errorMessage={messageErrors}
        />
        {errorMessage && (
          <Checkbox
            checked={sendErrorLogs}
            style={tw`self-stretch`}
            onPress={() => setSendErrorLogs(!sendErrorLogs)}
          >
            {i18n("settings.report.sendErrorLogs")}
          </Checkbox>
        )}
      </PeachScrollView>
      <Button
        style={tw`self-center`}
        onPress={submit}
        disabled={!(isEmailValid && isTopicValid && isMessageValid)}
      >
        {i18n("report.sendReport")}
      </Button>
    </Screen>
  );
};
