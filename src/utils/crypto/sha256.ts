import { crypto } from "bitcoinjs-lib";

export const sha256 = (str: string): string =>
  crypto.sha256(Buffer.from(str)).toString("hex");
