import { PsbtInput, PsbtOutput } from "bip174/src/lib/interfaces";
import { BIP32Interface } from "bip32";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { ElementsValue, address, payments } from "liquidjs-lib";
import { Psbt } from "liquidjs-lib/src/psbt";
import { getLiquidNetwork } from "../../../src/utils/wallet/getLiquidNetwork";
import { asset, liquidAddresses } from "../data/liquidNetworkData";
import { getLiquidScript } from "./getLiquidScript";

interface PsbtOutputExtendedAddress extends PsbtOutput {
  address: string;
  value: Buffer;
}
interface PsbtOutputExtendedScript extends PsbtOutput {
  script: Buffer;
  value: Buffer;
}
type PsbtOutputExtended = PsbtOutputExtendedAddress | PsbtOutputExtendedScript;

export const constructLiquidPSBT = (
  wallet: BIP32Interface,
  inputOptions: Partial<PsbtInput> = {},
  ouputOptions: Partial<PsbtOutputExtended> = {},
) => {
  const network = getLiquidNetwork();
  const p2wsh = payments.p2wsh({
    network,
    redeem: {
      output: getLiquidScript(wallet.publicKey),
      network,
    },
  });
  const redeemOutput =
    p2wsh.redeem?.output ?? getLiquidScript(wallet.publicKey);
  const psbt = new Psbt({ network });
  const inputValue = 10000000;
  const fee = 300;
  psbt.addInput({
    hash: "d8a31704d33febfc8a4271c3f9d65b5d7679c5cab19f25058f2d7d2bc6e7b86c",
    index: 0,
    witnessScript: p2wsh.redeem?.output,
    witnessUtxo: {
      script: Buffer.from(`0020${sha256(redeemOutput).toString("hex")}`, "hex"),
      // @ts-ignore that's definitely a Buffer type
      value: ElementsValue.fromNumber(inputValue).bytes,
      asset: asset.regtest,
      nonce: Buffer.from("00", "hex"),
    },
    ...inputOptions,
  });
  psbt.addOutput({
    script: address.toOutputScript(liquidAddresses.regtest[0], network),
    value: ElementsValue.fromNumber(inputValue - fee).bytes,
    asset: asset.regtest,
    nonce: Buffer.from("00", "hex"),
    ...ouputOptions,
  });
  return psbt;
};
