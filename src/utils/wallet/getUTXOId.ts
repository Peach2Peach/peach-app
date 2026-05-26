import type { LocalOutput } from "bdk-rn";

export const getUTXOId = ({ outpoint: { txid, vout } }: LocalOutput) =>
  `${txid.toString()}:${vout}`;
