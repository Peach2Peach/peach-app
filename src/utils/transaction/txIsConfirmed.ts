import type { WalletTx } from "../wallet/bdkShim";

export const txIsConfirmed = (tx: WalletTx) => !!tx.confirmationTime?.height;
