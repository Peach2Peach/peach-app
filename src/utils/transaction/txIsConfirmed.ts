import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";

export const txIsConfirmed = (tx: TransactionDetails) =>
  !!tx.confirmationTime?.height;
