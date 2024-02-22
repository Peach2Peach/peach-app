import { View } from "react-native";
import { PeachText } from "../components/text/PeachText";
import tw from "../styles/tailwind";
import { tolgee } from "../tolgee";
import { useTranslate } from "@tolgee/react";

const ReportSuccess = () => {
  const { t } = useTranslate("unassigned");
  return (
    <View>
      <PeachText style={tw`my-2`}>{t("report.success.text.1")}</PeachText>
      <PeachText>{t("report.success.text.2")}</PeachText>
    </View>
  );
};

export const appPopups = {
  // TODO: not sure if I replace those as well
  offerTaken: {
    title: tolgee.t("search.popups.offerTaken.title", { ns: "unassigned" }),
    content: tolgee.t("search.popups.offerTaken.text", { ns: "unassigned" }),
  },
  matchUndone: {
    title: tolgee.t("search.popups.matchUndone.title", { ns: "unassigned" }),
    content: tolgee.t("search.popups.matchUndone.text", { ns: "unassigned" }),
  },
  reportSuccess: {
    title: tolgee.t("report.success.title", { ns: "unassigned" }),
    content: ReportSuccess,
  },
};

export type AppPopupId = keyof typeof appPopups;
