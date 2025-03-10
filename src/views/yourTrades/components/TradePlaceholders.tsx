import { TouchableOpacity, View } from "react-native";
import { Icon } from "../../../components/Icon";
import { PeachText } from "../../../components/text/PeachText";
import { HorizontalLine } from "../../../components/ui/HorizontalLine";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

type Props = {
  tab: TradeTab;
};
export const TradePlaceholders = ({ tab }: Props) => (
  <View style={tw`items-center justify-center flex-1`}>
    <PeachText style={tw`h6 text-black-50`}>
      {i18n("yourTrades.empty")}
    </PeachText>
    {tab !== "yourTrades.history" && (
      <>
        <HorizontalLine style={tw`w-full my-8 bg-black-5`} />
        <GoTradeButton tab={tab} />
      </>
    )}
  </View>
);

function GoTradeButton({
  tab,
}: {
  tab: Exclude<TradeTab, "yourTrades.history">;
}) {
  const navigation = useStackNavigation();

  const onPress = () => {
    const destination =
      tab === "yourTrades.buy" ? "buyOfferPreferences" : "sellOfferPreferences";
    navigation.navigate(destination);
  };

  const textColor =
    tab === "yourTrades.buy"
      ? tw.color("success-main")
      : tw.color("primary-main");

  return (
    <TouchableOpacity onPress={onPress} style={tw`flex-row items-center gap-2`}>
      <PeachText style={[tw`h6`, { color: textColor }]}>
        {i18n(
          `yourTrades.start.${tab === "yourTrades.sell" ? "selling" : "buying"}`,
        )}
      </PeachText>
      <Icon id="arrowRightCircle" size={20} color={textColor} />
    </TouchableOpacity>
  );
}
