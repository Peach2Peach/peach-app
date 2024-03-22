import { TouchableOpacity } from "react-native";
import { Icon } from "../../../components/Icon";
import { TradeInfo } from "../../../components/offer/TradeInfo";
import tw from "../../../styles/tailwind";
import { showAddress } from "../../../utils/blockchain/showAddress";
import { showTransaction } from "../../../utils/blockchain/showTransaction";
import i18n from "../../../utils/i18n";
import { isLiquidAddress } from "../../../utils/validation/rules";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";

export function ShowInExplorer({
  txId,
  address,
}: {
  txId?: string;
  address: string;
}) {
  const openInExplorer = () =>
    txId
      ? showTransaction(
          txId,
          isLiquidAddress(address, getLiquidNetwork()) ? "liquid" : "bitcoin",
        )
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
