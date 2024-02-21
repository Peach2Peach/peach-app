import { PsbtInput as LiquidPsbtInput } from "bip174-liquid/src/lib/interfaces";
import { opcodes, payments, script } from "liquidjs-lib";
import { getLiquidNetwork } from "./getLiquidNetwork";
import { witnessStackToScriptWitness } from "./witnessStackToScriptWitness";

/**
 * @description Method to to finalize scripts for Peach escrow PSBT
 * @param inputIndex index of input to finalize
 * @param input the input itself
 * @param bitcoinScript the script of given input
 * @returns final script
 */
export const getFinalScriptLiquid = (
  inputIndex: number,
  input: LiquidPsbtInput,
  bitcoinScript: Buffer,
): {
  finalScriptSig: Buffer | undefined;
  finalScriptWitness: Buffer | undefined;
} => {
  if (!input.partialSig) {
    throw new Error("Could not find partial signatures");
  }

  const network = getLiquidNetwork();
  const decompiled = script.decompile(bitcoinScript);
  const meaningFulSignatures = input.partialSig.every((sig) =>
    bitcoinScript.toString("hex").includes(sig.pubkey.toString("hex")),
  );
  if (!decompiled) {
    throw new Error(`Can not finalize input #${inputIndex}`);
  }
  if (!meaningFulSignatures) {
    throw new Error(
      `Can not finalize input #${inputIndex}. Signatures do not correspond to public keys`,
    );
  }

  const payment = payments.p2wsh({
    network,
    redeem: {
      network,
      output: bitcoinScript,
      input:
        input.partialSig.length === 2
          ? script.compile([
              input.partialSig[0].signature,
              input.partialSig[1].signature,
              opcodes.OP_FALSE,
            ])
          : script.compile([input.partialSig[0].signature, opcodes.OP_TRUE]),
    },
  });

  return {
    finalScriptSig: undefined,
    finalScriptWitness:
      payment.witness && payment.witness.length > 0
        ? witnessStackToScriptWitness(payment.witness)
        : undefined,
  };
};
