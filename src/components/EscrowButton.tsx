import { NETWORK } from "@env";
import { StyleProp, ViewStyle } from "react-native";
import tw from "../styles/tailwind";
import { showAddress } from "../utils/bitcoin/showAddress";
import { showTransaction } from "../utils/bitcoin/showTransaction";
import i18n from "../utils/i18n";
import { Button } from "./buttons/Button";

type Props = {
  releaseTxId?: string;
  escrow?: string;
  style?: StyleProp<ViewStyle>;
};

export function EscrowButton({ releaseTxId, escrow, style }: Props) {
  const openEscrow = () => {
    if (!escrow) return;
    if (releaseTxId) {
      showTransaction(releaseTxId, NETWORK);
    }
    showAddress(escrow, NETWORK);
  };

  return (
    <Button
      iconId="externalLink"
      style={style}
      textColor={tw.color("primary-main")}
      ghost
      onPress={openEscrow}
      disabled={!escrow}
    >
      {i18n("escrow")}
    </Button>
  );
}
