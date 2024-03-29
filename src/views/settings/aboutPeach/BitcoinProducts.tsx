import { TouchableOpacity, View } from "react-native";
import { Icon } from "../../../components/Icon";
import { Screen } from "../../../components/Screen";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { goToShiftCrypto } from "../../../utils/web/goToShiftCrypto";

export const BitcoinProducts = () => (
  <Screen header={i18n("settings.bitcoinProducts")}>
    <View style={tw`justify-center grow`}>
      <PeachText style={tw`h5`}>
        {i18n("settings.bitcoinProducts.proSecurity")}
      </PeachText>
      <PeachText style={tw`mt-1`}>
        {i18n("settings.bitcoinProducts.proSecurity.description1")}
        {"\n\n"}
        {i18n("settings.bitcoinProducts.proSecurity.description2")}
      </PeachText>
      <TouchableOpacity
        style={tw`flex-row items-center gap-4 mt-4`}
        onPress={goToShiftCrypto}
      >
        <PeachText style={tw`underline text-primary-main settings`}>
          {i18n("settings.bitcoinProducts.bitBox")}
        </PeachText>
        <Icon
          id="externalLink"
          style={tw`w-6 h-6 -mt-1`}
          color={tw.color("primary-main")}
        />
      </TouchableOpacity>
    </View>
  </Screen>
);
