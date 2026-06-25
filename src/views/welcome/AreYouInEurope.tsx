import { Image, useWindowDimensions, View } from "react-native";
import aWalletYouControl from "../../assets/onboarding/a-wallet-you-control.png";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { useLanguage } from "../../hooks/useLanguage";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { getLocalizedLink } from "../../utils/web/getLocalizedLink";
import { openURL } from "../../utils/web/openURL";

const ASPECT_RATIO = 0.7;
export const AreYouInEurope = () => {
  const { width } = useWindowDimensions();
  const { locale } = useLanguage();

  return (
    <View style={[tw`items-center justify-center h-full px-sm`, tw`md:px-md`]}>
      <PeachText style={tw`text-center h5 text-primary-background-light-color`}>
        {i18n("welcome.areYouInEurope.title")}
      </PeachText>
      <PeachText
        style={tw`mt-4 text-center text-primary-background-light-color`}
      >
        {i18n("welcome.areYouInEurope.description")}
      </PeachText>
      <Image
        source={aWalletYouControl}
        style={{ width, height: width * ASPECT_RATIO }}
        resizeMode="contain"
      />
      <Button
        style={tw`bg-primary-background-light-color`}
        textColor={tw.color("primary-main")}
        onPress={() =>
          openURL(getLocalizedLink("terms-and-conditions", locale))
        }
      >
        {i18n("welcome.areYouInEurope.checkTerms")}
      </Button>
    </View>
  );
};
