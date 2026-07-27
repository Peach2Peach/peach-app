import { NETWORK } from "@env";
import { StyleProp, ViewStyle } from "react-native";
import tw from "../styles/tailwind";
import { showAddress } from "../utils/bitcoin/showAddress";
import { showTransaction } from "../utils/bitcoin/showTransaction";
import i18n, { useI18n } from "../utils/i18n";
import { showLiquidAddress } from "../utils/liquid/showLiquidAddress";
import { showLiquidTransaction } from "../utils/liquid/showLiquidTransaction";
import { Button } from "./buttons/Button";

type Props = {
  releaseTxId?: string;
  escrow: string;
  /** a liquid escrow (address + release tx) lives on Liquid, so its explorer
   * links must point there rather than at a Bitcoin explorer */
  escrowType?: "bitcoin" | "liquid";
  style?: StyleProp<ViewStyle>;
};

export function EscrowButton({
  releaseTxId,
  escrow,
  escrowType = "bitcoin",
  style,
}: Props) {
  useI18n();
  const isLiquid = escrowType === "liquid";
  const openEscrow = () => {
    if (releaseTxId) {
      return isLiquid
        ? showLiquidTransaction(releaseTxId, NETWORK)
        : showTransaction(releaseTxId, NETWORK);
    }
    return isLiquid
      ? showLiquidAddress(escrow, NETWORK)
      : showAddress(escrow, NETWORK);
  };

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
