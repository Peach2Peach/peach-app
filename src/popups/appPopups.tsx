import { View } from "react-native";
import { PeachText } from "../components/text/PeachText";
import tw from "../styles/tailwind";
import { tolgee } from "../tolgee";
import { useTranslate } from "@tolgee/react";

const ReportSuccess = () => {
  const { t } = useTranslate();
  return (
    <View>
      <PeachText style={tw`my-2`}>{t("report.success.text.1")}</PeachText>
      <PeachText>{t("report.success.text.2")}</PeachText>
    </View>
  );
};

export const appPopups = {
  offerTaken: {
    title: tolgee.t("search.popups.offerTaken.title"),
    content: tolgee.t("search.popups.offerTaken.text"),
  },
  matchUndone: {
    title: tolgee.t("search.popups.matchUndone.title"),
    content: tolgee.t("search.popups.matchUndone.text"),
  },
  reportSuccess: {
    title: tolgee.t("report.success.title"),
    content: ReportSuccess,
  },
};

export type AppPopupId = keyof typeof appPopups;
