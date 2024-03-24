import { TouchableOpacity } from "react-native";
import { Icon } from "../../../components/Icon";
import { TradeInfo } from "../../../components/offer/TradeInfo";
import tw from "../../../styles/tailwind";
import { getAddressChain } from "../../../utils/blockchain/getAddressChain";
import { showAddress } from "../../../utils/blockchain/showAddress";
import { showTransaction } from "../../../utils/blockchain/showTransaction";
import i18n from "../../../utils/i18n";

type Props = {
  txId?: string;
  address: string;
};

export function ShowInExplorer({ txId, address }: Props) {
  const openInExplorer = () =>
    txId
      ? showTransaction(txId, getAddressChain(address))
      : showAddress(address);
  return (
    <TouchableOpacity onPress={openInExplorer}>
      <TradeInfo
        style={tw`self-center`}
        text={i18n("showInExplorer")}
        textStyle={tw`underline`}
        IconComponent={
          <Icon
            id="externalLink"
            style={tw`w-5 h-5`}
            color={tw.color("primary-main")}
          />
        }
      />
    </TouchableOpacity>
  );
}
