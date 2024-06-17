import { TouchableOpacity } from "react-native";
import "react-native-url-polyfill/auto";
import tw from "../../styles/tailwind";
import { openInWallet } from "../../utils/bitcoin/openInWallet";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { useTranslate } from "@tolgee/react";

type OpenWalletProps = ComponentProps & {
  address?: string;
};

export const OpenWallet = ({ address, style }: OpenWalletProps) => {
  const openWalletApp = () => openInWallet(`bitcoin:${address ?? ""}`);
  const { t } = useTranslate("wallet");

  return (
    <TouchableOpacity
      style={[tw`flex-row items-center justify-center`, style]}
      onPress={openWalletApp}
    >
      <PeachText style={tw`underline uppercase button-medium text-black-65`}>
        {t("wallet.openWalletApp")}
      </PeachText>
      <Icon
        id="externalLink"
        style={tw`w-4 h-4 ml-1 -mt-1`}
        color={tw.color("primary-main")}
      />
    </TouchableOpacity>
  );
};
