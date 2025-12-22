import { ChainPosition_Tags, TxDetails } from "bdk-rn";

export const txIsConfirmed = (tx: TxDetails) => {
  return tx.chainPosition.tag === ChainPosition_Tags.Confirmed
}
