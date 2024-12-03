import { Image, View } from "react-native";
import bitcoinAnimation from "../../assets/animated/bitcoin.gif";
import { PeachText } from "../../components/text/PeachText";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

type Props = {
  text?: string;
};

export const BitcoinLoading = ({ text }: Props) => {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={tw`items-center justify-center flex-1 gap-8`}>
      <View style={tw`pr-6px`}>
        <Image
          source={bitcoinAnimation}
          style={tw`w-32 h-32`}
          resizeMode="cover"
        />
      </View>
      <PeachText
        style={[
          tw`text-center subtitle-1`,
          isDarkMode ? tw`text-primary-mild-1` : tw`text-black-100`,
        ]}
      >
        {text || i18n("loading")}
      </PeachText>
    </View>
  );
};
