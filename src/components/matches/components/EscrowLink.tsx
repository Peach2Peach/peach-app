import { TouchableOpacity } from "react-native";
import tw from "../../../styles/tailwind";
import { showAddress } from "../../../utils/blockchain/showAddress";
import i18n from "../../../utils/i18n";
import { Icon } from "../../Icon";
import { PeachText } from "../../text/PeachText";

export const EscrowLink = ({ address }: { address: string }) => (
  <TouchableOpacity
    style={tw`flex-row items-center justify-center gap-1`}
    onPress={() => showAddress(address)}
  >
    <PeachText style={tw`underline tooltip text-black-65`}>
      {i18n("escrow.viewInExplorer")}
    </PeachText>
    <Icon id="externalLink" size={18} color={tw.color("primary-main")} />
  </TouchableOpacity>
);
