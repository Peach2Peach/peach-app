import { PsbtInput, PsbtOutput } from "bip174/src/lib/interfaces";
import { BIP32Interface } from "bip32";
import { Psbt, payments } from "bitcoinjs-lib";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { getNetwork } from "../../../src/utils/wallet/getNetwork";
import { getScript } from "./getScript";

interface PsbtOutputExtendedAddress extends PsbtOutput {
  address: string;
  value: number;
}
interface PsbtOutputExtendedScript extends PsbtOutput {
  script: Buffer;
  value: number;
}
type PsbtOutputExtended = PsbtOutputExtendedAddress | PsbtOutputExtendedScript;

export const constructPSBT = (
  wallet: BIP32Interface,
  inputOptions: Partial<PsbtInput> = {},
  ouputOptions: Partial<PsbtOutputExtended> = {},
) => {
  const network = getNetwork();
  const p2wsh = payments.p2wsh({
    network,
    redeem: {
      output: getScript(wallet.publicKey),
      network,
    },
  });
  const redeemOutput = p2wsh.redeem?.output ?? getScript(wallet.publicKey);
  const psbt = new Psbt({ network });
  const inputValue = 10000000;
  const fee = 300;
  psbt.addInput({
    hash: "d8a31704d33febfc8a4271c3f9d65b5d7679c5cab19f25058f2d7d2bc6e7b86c",
    index: 0,
    witnessScript: p2wsh.redeem?.output,
    witnessUtxo: {
      script: Buffer.from(`0020${sha256(redeemOutput).toString("hex")}`, "hex"),
      value: inputValue,
    },
    ...inputOptions,
  });
  psbt.addOutput({
    address: "bcrt1q348u075ehsuk0rz9lat22zrhlpgspj4twmt3m3pf0e5jjdm98u4qpet6g7",
    value: inputValue - fee,
    ...ouputOptions,
  });
  return psbt;
};
