import {
  Transaction,
  UTXO,
} from "../../../../peach-api/src/@types/electrs-liquid";

export const toUTXO = (txs: Transaction[], address: string): UTXO[] => {
  const utxos = txs
    .filter((tx) =>
      tx.vout.some((vout) => vout.scriptpubkey_address === address),
    )
    .filter((inTx) => {
      const vout = inTx.vout.findIndex(
        (v) => v.scriptpubkey_address === address,
      );
      const out = txs.find((tx) =>
        tx.vin.some((vin) => vin.txid === inTx.txid && vin.vout === vout),
      );
      return !out;
    });

  return utxos.map((utxo) => {
    const vout = utxo.vout.find((v) => v.scriptpubkey_address === address);
    if (!vout) throw Error("OUTPUT_NOT_FOUND");
    return {
      txid: utxo.txid,
      asset: vout.asset,
      vout: utxo.vout.findIndex((v) => v.scriptpubkey_address === address),
      value: vout.value,
      status: utxo.status,
    };
  });
};
