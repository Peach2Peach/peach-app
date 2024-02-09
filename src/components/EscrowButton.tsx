import { StyleProp, ViewStyle } from "react-native";
import tw from "../styles/tailwind";
import { showAddress } from "../utils/blockchain/showAddress";
import { showTransaction } from "../utils/blockchain/showTransaction";
import i18n from "../utils/i18n";
import { isLiquidAddress } from "../utils/validation/rules";
import { Button } from "./buttons/Button";

type Props = {
  releaseTxId?: string;
  escrow: string;
  style?: StyleProp<ViewStyle>;
};

export function EscrowButton({ releaseTxId, escrow, style }: Props) {
  const network = isLiquidAddress(escrow) ? 'liquid' : 'bitcoin'
  const openEscrow = () =>
    releaseTxId
      ? showTransaction(releaseTxId, network)
      : showAddress(escrow, network);

  return (
    <Button
      iconId="externalLink"
      style={style}
      textColor={tw`text-primary-main`}
      ghost
      onPress={openEscrow}
    >
      {i18n("escrow")}
    </Button>
  );
}
