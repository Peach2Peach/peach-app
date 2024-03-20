import { NETWORK } from "@env";
import { StyleProp, ViewStyle } from "react-native";
import tw from "../styles/tailwind";
import { showAddress } from "../utils/bitcoin/showAddress";
import { showTransaction } from "../utils/bitcoin/showTransaction";
import { Button } from "./buttons/Button";
import { useTranslate } from "@tolgee/react";

type Props = {
  releaseTxId?: string;
  escrow: string;
  style?: StyleProp<ViewStyle>;
};

export function EscrowButton({ releaseTxId, escrow, style }: Props) {
  const openEscrow = () =>
    releaseTxId
      ? showTransaction(releaseTxId, NETWORK)
      : showAddress(escrow, NETWORK);
  const { t } = useTranslate("offer");

  return (
    <Button
      iconId="externalLink"
      style={style}
      textColor={tw.color("primary-main")}
      ghost
      onPress={openEscrow}
    >
      {t("escrow")}
    </Button>
  );
}
