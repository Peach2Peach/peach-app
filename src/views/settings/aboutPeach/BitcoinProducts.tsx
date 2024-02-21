import { TouchableOpacity, View } from "react-native";
import { Icon } from "../../../components/Icon";
import { Screen } from "../../../components/Screen";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import { goToShiftCrypto } from "../../../utils/web/goToShiftCrypto";
import { tolgee } from "../../../tolgee";

export const BitcoinProducts = () => (
  <Screen header={tolgee.t("settings.bitcoinProducts", { ns: "settings" })}>
    <View style={tw`justify-center grow`}>
      <PeachText style={tw`h5`}>
        {tolgee.t("settings.bitcoinProducts.proSecurity", { ns: "settings" })}
      </PeachText>
      <PeachText style={tw`mt-1`}>
        {tolgee.t("settings.bitcoinProducts.proSecurity.description1", {
          ns: "settings",
        })}
        {"\n\n"}
        {tolgee.t("settings.bitcoinProducts.proSecurity.description2", {
          ns: "settings",
        })}
      </PeachText>
      <TouchableOpacity
        style={tw`flex-row items-center gap-4 mt-4`}
        onPress={goToShiftCrypto}
      >
        <PeachText style={tw`underline text-primary-main settings`}>
          {tolgee.t("settings.bitcoinProducts.bitBox", { ns: "settings" })}
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
