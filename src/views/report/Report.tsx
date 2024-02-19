import { useRef } from "react";
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
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { useValidatedState } from "../../hooks/useValidatedState";
import { AppPopup } from "../../popups/AppPopup";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { useSendReport } from "./useSendReport";
import { useTranslate } from "@tolgee/react";

const emailRules = { email: true, required: true };
const required = { required: true };

export const Report = () => {
  const route = useRoute<"report">();
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const [email, setEmail, isEmailValid, emailErrors] =
    useValidatedState<string>("", emailRules);
  const [topic, setTopic, isTopicValid, topicErrors] = useValidatedState(
    route.params.topic || "",
    required,
  );
  const [message, setMessage, isMessageValid, messageErrors] =
    useValidatedState(route.params.message || "", required);
  const [shareDeviceID, toggleDeviceIDSharing] = useToggleBoolean(
    route.params.shareDeviceID || false,
  );
  const [shareLogs, toggleShareLogs] = useToggleBoolean(false);
  const reason = route.params.reason;
  const publicKey = useAccountStore((state) => state.account.publicKey);

  const showError = useShowErrorBanner();

  const { mutate: submitReport } = useSendReport();
  const { t } = useTranslate("form");

  const submit = () => {
    const isFormValid = isEmailValid && isTopicValid && isMessageValid;
    if (!isFormValid) return;

    submitReport(
      {
        email,
        reason: t({
          key: `contact.reason.${reason}`,
          ns: "contract",
        }),
        topic,
        message,
        shareDeviceID,
        shareLogs,
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
    <Screen
      header={t({
        key: "contact.title",
        ns: "contract",
      })}
    >
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <EmailInput
          onChangeText={setEmail}
          onSubmitEditing={() => $topic?.focus()}
          value={email}
          placeholder={t("form.userEmail.placeholder")}
          errorMessage={emailErrors}
        />
        <Input
          onChangeText={setTopic}
          onSubmitEditing={() => $message?.focus()}
          reference={(el) => ($topic = el)}
          value={topic}
          placeholder={t("form.topic.placeholder")}
          errorMessage={topicErrors}
        />
        <Input
          style={tw`h-40`}
          onChangeText={setMessage}
          reference={(el) => ($message = el)}
          value={message}
          multiline={true}
          placeholder={t("form.message.placeholder")}
          errorMessage={messageErrors}
        />
        {!publicKey && (
          <Checkbox onPress={toggleDeviceIDSharing} checked={shareDeviceID}>
            {t("form.includeDeviceIDHash")}
          </Checkbox>
        )}
        <Checkbox onPress={toggleShareLogs} checked={shareLogs}>
          {t("form.shareLogs")}
        </Checkbox>
      </PeachScrollView>
      <Button
        style={tw`self-center`}
        onPress={submit}
        disabled={!(isEmailValid && isTopicValid && isMessageValid)}
      >
        {t({
          key: "report.sendReport",
          ns: "unassigned",
        })}
      </Button>
    </Screen>
  );
};
