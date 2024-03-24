import { StyleProp, ViewStyle } from "react-native";
import tw from "../styles/tailwind";
import { getAddressChain } from "../utils/blockchain/getAddressChain";
import { showAddress } from "../utils/blockchain/showAddress";
import { showTransaction } from "../utils/blockchain/showTransaction";
import i18n from "../utils/i18n";
import { Button } from "./buttons/Button";

type Props = {
  releaseTxId?: string;
  escrow: string;
  style?: StyleProp<ViewStyle>;
};

export function EscrowButton({ releaseTxId, escrow, style }: Props) {
  const chain = getAddressChain(escrow);
  const openEscrow = () =>
    releaseTxId ? showTransaction(releaseTxId, chain) : showAddress(escrow);

  return (
    <Button
      iconId="externalLink"
      style={style}
      textColor={tw.color("primary-main")}
      ghost
      onPress={openEscrow}
    >
      {i18n("escrow")}
    </Button>
  );
}
