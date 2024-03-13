import { DUST_LIMIT } from "../wallet/liquid/constants";
import { UTXOWithPath } from "../wallet/useLiquidWalletState";

export const selectUTXONewestFirst = (
  utxos: UTXOWithPath[],
  amount: number,
) => {
  console.log(
    amount,
    utxos.map((u) => u.value),
  );
  let selectedAmount = -DUST_LIMIT;

  return utxos
    .toSorted((a, b) => {
      if (!a.status.block_height) return -1;
      if (!b.status.block_height) return 1;
      return a.status.block_height < b.status.block_height ? 1 : -1;
    })
    .filter((utxo) => {
      if (selectedAmount > amount) return false;
      selectedAmount += utxo.value;
      return true;
    });
};
