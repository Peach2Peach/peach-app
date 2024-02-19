import { View } from "react-native";
import { PeachText } from "../components/text/PeachText";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";

const ReportSuccess = () => (
  <View>
    <PeachText style={tw`my-2`}>{i18n("report.success.text.1")}</PeachText>
    <PeachText>{i18n("report.success.text.2")}</PeachText>
  </View>
);

// eslint-disable-next-line no-warning-comments
// TODO: figure out how to integrate telgoo
export const appPopups = {
  offerTaken: {
    title: i18n("search.popups.offerTaken.title"),
    content: i18n("search.popups.offerTaken.text"),
  },
  matchUndone: {
    title: i18n("search.popups.matchUndone.title"),
    content: i18n("search.popups.matchUndone.text"),
  },
  reportSuccess: {
    title: i18n("report.success.title"),
    content: ReportSuccess,
  },
};

export type AppPopupId = keyof typeof appPopups;
