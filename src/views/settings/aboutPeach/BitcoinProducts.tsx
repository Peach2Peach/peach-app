import { TouchableOpacity, View } from "react-native";
import { Icon } from "../../../components/Icon";
import { Screen } from "../../../components/Screen";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import { goToShiftCrypto } from "../../../utils/web/goToShiftCrypto";
import { useTranslate } from "@tolgee/react";

export const BitcoinProducts = () => {
  const { t } = useTranslate("settings");

  return (
    <Screen header={t("settings.bitcoinProducts")}>
      <View style={tw`justify-center grow`}>
        <PeachText style={tw`h5`}>
          {t("settings.bitcoinProducts.proSecurity")}
        </PeachText>
        <PeachText style={tw`mt-1`}>
          {t("settings.bitcoinProducts.proSecurity.description1")}
          {"\n\n"}
          {t("settings.bitcoinProducts.proSecurity.description2")}
        </PeachText>
        <TouchableOpacity
          style={tw`flex-row items-center gap-4 mt-4`}
          onPress={goToShiftCrypto}
        >
          <PeachText style={tw`underline text-primary-main settings`}>
            {t("settings.bitcoinProducts.bitBox")}
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
};
