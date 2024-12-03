import { TouchableOpacity } from "react-native";
import "react-native-url-polyfill/auto";
import tw from "../../styles/tailwind";
import { openInWallet } from "../../utils/bitcoin/openInWallet";
import i18n from "../../utils/i18n";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type OpenWalletProps = ComponentProps & {
  address?: string;
};

export const OpenWallet = ({ address, style }: OpenWalletProps) => {
  const openWalletApp = () => openInWallet(`bitcoin:${address ?? ""}`);

  return (
    <TouchableOpacity
      style={[tw`flex-row items-center justify-center`, style]}
      onPress={openWalletApp}
    >
      <PeachText style={tw`underline uppercase button-medium text-black-50`}>
        {i18n("wallet.openWalletApp")}
      </PeachText>
      <Icon
        id="externalLink"
        style={tw`w-4 h-4 ml-1 -mt-1`}
        color={tw.color("primary-main")}
      />
    </TouchableOpacity>
  );
};
