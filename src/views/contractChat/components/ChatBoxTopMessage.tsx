import { View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

export const ChatBoxTopMessage = ({ isContract }: { isContract: boolean }) => {
  return (
    <View
      style={{
        backgroundColor: tw.color("warning-mild-1"),
        margin: 20,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <PeachText style={tw`text-center subtitle-0`}>
        {i18n("chat.tradingRules.title")}
      </PeachText>

      <PeachText />

      <PeachText style={tw``}>
        {i18n("chat.tradingRules.text")}
        {isContract && "\n" + i18n("chat.tradingRules.disputeText")}
      </PeachText>
    </View>
  );
};
