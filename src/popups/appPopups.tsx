import { View } from "react-native";
import { PeachText } from "../components/text/PeachText";
import tw from "../styles/tailwind";
import { tolgee } from "../tolgee";

const ReportSuccess = () => (
  <View>
    <PeachText style={tw`my-2`}>
      {tolgee.t("report.success.text.1", { ns: "unassigned" })}
    </PeachText>
    <PeachText>
      {tolgee.t("report.success.text.2", { ns: "unassigned" })}
    </PeachText>
  </View>
);

export const appPopups = {
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
