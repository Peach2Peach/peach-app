import { script } from "bitcoinjs-lib";

export const getScript = (publicKey: Buffer): Buffer =>
  script.fromASM(`${publicKey.toString("hex")} OP_CHECKSIG`);
