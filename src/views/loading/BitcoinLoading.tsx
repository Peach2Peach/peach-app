import { Image, View } from "react-native";
import bitcoinAnimation from "../../assets/animated/bitcoin.gif";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import { tolgee } from "../../tolgee";

type Props = {
  text?: string;
};
export const BitcoinLoading = ({ text }: Props) => (
  <View style={tw`items-center justify-center flex-1 gap-8`}>
    <View style={tw`pr-6px`}>
      <Image
        source={bitcoinAnimation}
        style={tw`w-32 h-32`}
        resizeMode="cover"
      />
    </View>
    <PeachText style={tw`text-center subtitle-1`}>
      {text || tolgee.t("loading")}
    </PeachText>
  </View>
);
