import { View } from "react-native";
import { Icon } from "../../../components/Icon";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

export const ChatBoxTopMessage = ({
  isContract,
  paymentMethod,
}: {
  isContract: boolean;
  paymentMethod?: PaymentMethod;
}) => {
  return (
    <>
      <View
        style={{
          backgroundColor: tw.color("warning-mild-1"),
          margin: 20,
          borderRadius: 16,
          padding: 20,
        }}
      >
        <PeachText style={tw`text-center subtitle-0 text-black-100`}>
          {i18n("chat.tradingRules.title")}
        </PeachText>

        <PeachText />

        <PeachText style={tw`text-black-100`}>
          {i18n("chat.tradingRules.text")}
          {isContract && "\n" + i18n("chat.tradingRules.disputeText")}
        </PeachText>
      </View>
      {paymentMethod === "revolut" && (
        <View
          style={{
            backgroundColor: tw.color("warning-main"),
            margin: 20,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                id="alertTriangle"
                style={tw`w-8 h-8 mr-2 mb-2`}
                color={tw.color("black-100")}
              />
              <PeachText style={tw`subtitle-0 text-black-100`}>
                {i18n("chat.revolutWarning.title")}
              </PeachText>
            </View>
          </View>

          <PeachText style={tw`text-black-100 text-center`}>
            {i18n("chat.revolutWarning.text")}
          </PeachText>
        </View>
      )}
    </>
  );
};
