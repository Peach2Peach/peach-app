import { View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";

export const Trades = ({
  canceledTrades,
  trades,
  style,
}: { trades: number, canceledTrades: number } & ComponentProps) => (
  <View style={style}>
    <View style={style}>
      <PeachText style={tw`lowercase text-black-65`}>
        {i18n("profile.numberOfTrades")}:
      </PeachText>
      <PeachText style={tw`subtitle-1`}>{trades}</PeachText>
    </View>
    <View style={style}>
      <PeachText style={tw`lowercase text-black-65`}>
        {i18n("profile.canceledTrades")}:
      </PeachText>
      <PeachText style={tw`subtitle-1`}>{canceledTrades}</PeachText>
    </View>
  </View>
);
