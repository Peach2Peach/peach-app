import { BIP32Interface } from "bip32";
import { Psbt } from "bitcoinjs-lib";

export const signPSBT = (psbt: Psbt, wallet: BIP32Interface): Psbt => {
  psbt.txInputs.forEach((input, i) => {
    const { sighashType } = psbt.data.inputs[i];
    psbt.signInput(i, wallet, sighashType ? [sighashType] : undefined);
  });

  return psbt;
};
