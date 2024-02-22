import { NETWORK } from "@env";
import { TouchableOpacity } from "react-native";
import tw from "../../../styles/tailwind";
import { showAddress } from "../../../utils/bitcoin/showAddress";
import { Icon } from "../../Icon";
import { PeachText } from "../../text/PeachText";
import { useTranslate } from "@tolgee/react";

export const EscrowLink = ({ address }: { address: string }) => {
  const { t } = useTranslate("unassigned");
  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-center gap-1`}
      onPress={() => showAddress(address, NETWORK)}
    >
      <PeachText style={tw`underline tooltip text-black-65`}>
        {t("escrow.viewInExplorer")}
      </PeachText>
      <Icon id="externalLink" size={18} color={tw.color("primary-main")} />
    </TouchableOpacity>
  );
};
