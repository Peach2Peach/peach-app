import { BIP32Interface } from "bip32";
import { Psbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import { getFinalScript } from "../wallet/getFinalScript";
import { getFinalScriptLiquid } from "../wallet/getFinalScriptLiquid";

export const signAndFinalizePSBT = (
  psbt: Psbt | LiquidPsbt,
  wallet: BIP32Interface,
) => {
  psbt.txInputs.forEach((input, i) => {
    if (psbt instanceof Psbt) {
      psbt.signInput(i, wallet).finalizeInput(i, getFinalScript);
    } else {
      psbt.signInput(i, wallet).finalizeInput(i, getFinalScriptLiquid);
    }
  });

  return psbt;
};
