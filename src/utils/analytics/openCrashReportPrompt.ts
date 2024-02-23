import { Alert } from "react-native";
import { languageState } from "../i18n";
import { getLocalizedLink } from "../web/getLocalizedLink";
import { openURL } from "../web/openURL";
import { deleteUnsentReports } from "./deleteUnsentReports";
import { sendErrors } from "./sendErrors";
import { tolgee } from "../../tolgee";

export const openCrashReportPrompt = (errors: Error[]): void => {
  Alert.alert(
    tolgee.t("crashReport.requestPermission.title", { ns: "error" }),
    [
      tolgee.t("crashReport.requestPermission.description.1", { ns: "error" }),
      tolgee.t("crashReport.requestPermission.description.2", { ns: "error" }),
    ].join("\n\n"),
    [
      {
        text: tolgee.t("privacyPolicy", { ns: "error" }),
        onPress: () => {
          openCrashReportPrompt(errors);
          openURL(getLocalizedLink("privacy-policy", languageState.locale));
        },
        style: "default",
      },
      {
        text: tolgee.t("crashReport.requestPermission.deny", { ns: "error" }),
        onPress: deleteUnsentReports,
        style: "default",
      },
      {
        text: tolgee.t("crashReport.requestPermission.sendReport", {
          ns: "error",
        }),
        onPress: () => sendErrors(errors),
        style: "default",
      },
    ],
  );
};
