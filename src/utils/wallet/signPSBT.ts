import { BIP32Interface } from "bip32";
import { Psbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";

export const signPSBT = (psbt: Psbt | LiquidPsbt, wallet: BIP32Interface) => {
  psbt.txInputs.forEach((input, i) => {
    const { sighashType } = psbt.data.inputs[i];
    psbt.signInput(i, wallet, sighashType ? [sighashType] : undefined);
  });

  return psbt;
};
