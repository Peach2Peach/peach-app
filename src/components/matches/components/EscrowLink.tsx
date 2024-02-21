import { NETWORK } from "@env";
import { TouchableOpacity } from "react-native";
import tw from "../../../styles/tailwind";
import { showAddress } from "../../../utils/bitcoin/showAddress";
import { Icon } from "../../Icon";
import { PeachText } from "../../text/PeachText";
import { tolgee } from "../../../tolgee";

export const EscrowLink = ({ address }: { address: string }) => (
  <TouchableOpacity
    style={tw`flex-row items-center justify-center gap-1`}
    onPress={() => showAddress(address, NETWORK)}
  >
    <PeachText style={tw`underline tooltip text-black-65`}>
      {tolgee.t("escrow.viewInExplorer", { ns: "unassigned" })}
    </PeachText>
    <Icon id="externalLink" size={18} color={tw.color("primary-main")} />
  </TouchableOpacity>
);
