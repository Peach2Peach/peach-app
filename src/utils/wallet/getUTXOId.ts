import { LocalUtxo } from "bdk-rn/lib/classes/Bindings";

export const getUTXOId = ({ outpoint: { txid, vout } }: LocalUtxo) =>
  `${txid}:${vout}`;
