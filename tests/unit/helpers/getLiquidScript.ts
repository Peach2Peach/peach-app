import { script } from "liquidjs-lib";

export const getLiquidScript = (publicKey: Buffer): Buffer =>
  script.fromASM(`${publicKey.toString("hex")} OP_CHECKSIG`);
