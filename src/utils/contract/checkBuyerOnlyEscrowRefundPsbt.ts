import { Psbt, address as addressUtils } from "bitcoinjs-lib";
import { reverseBuffer } from "../crypto/reverseBuffer";
import { getNetwork } from "../wallet/getNetwork";

// virtual size of a taproot key path spend, which is what an escrowVersion 3
// refund is: the signature is always 64 bytes (SIGHASH_DEFAULT)
/** version + locktime + input and output counts, plus the segwit marker and flag */
const TX_OVERHEAD_VBYTES = 10 + 2 / 4;
/** outpoint + empty scriptSig + sequence, plus a 1 item witness with the signature */
const INPUT_VBYTES = 41 + 66 / 4;
/** value + script length, before the script itself */
const OUTPUT_BASE_VBYTES = 9;

/** a refund is never urgent, but must still confirm when fees spike */
export const REFUND_FEE_RATE_TOLERANCE = 2;
/** sat/vB a refund may always pay, so low estimates don't block it */
export const MIN_REFUND_FEE_RATE_CEILING = 10;

type Params = {
  psbt: Psbt;
  /** the contract's escrow address, already checked to be ours */
  escrow: string;
  funding: Pick<FundingStatus, "txIds" | "vouts" | "amounts">;
  returnAddress?: string;
  /** sat/vB */
  fastestFeeRate: number;
};

/**
 * @description throws unless the refund PSBT Peach built only spends this
 * contract's escrow, pays it all to the seller's return address and pays a
 * reasonable mining fee. Signing is checked by key too, but an input we don't
 * expect must be refused here, not just fail to sign.
 */
export const checkBuyerOnlyEscrowRefundPsbt = ({
  psbt,
  escrow,
  funding: { txIds, vouts, amounts },
  returnAddress,
  fastestFeeRate,
}: Params) => {
  const [output, ...otherOutputs] = psbt.txOutputs;
  if (otherOutputs.length > 0 || output?.address !== returnAddress) {
    throw new Error("RETURN_ADDRESS_MISMATCH");
  }

  if (
    txIds.length === 0 ||
    psbt.txInputs.length !== txIds.length ||
    vouts.length !== txIds.length ||
    amounts.length !== txIds.length
  ) {
    throw new Error("INVALID_INPUT");
  }

  const escrowScript = addressUtils.toOutputScript(escrow, getNetwork());
  const spent = new Set<number>();
  let inputTotal = 0;
  psbt.txInputs.forEach((input, i) => {
    // reverseBuffer works in place, so never hand it the PSBT's own buffer
    const txId = reverseBuffer(Buffer.from(input.hash)).toString("hex");
    const fundingIndex = txIds.findIndex(
      (id, j) => id === txId && vouts[j] === input.index && !spent.has(j),
    );
    if (fundingIndex === -1) throw new Error("INVALID_INPUT");
    spent.add(fundingIndex);

    // the signature commits to these, so they can't lie about a valid spend
    const { witnessUtxo } = psbt.data.inputs[i];
    if (
      !witnessUtxo ||
      !Buffer.from(witnessUtxo.script).equals(escrowScript) ||
      Number(witnessUtxo.value) !== amounts[fundingIndex]
    ) {
      throw new Error("INVALID_INPUT");
    }
    inputTotal += amounts[fundingIndex];
  });

  const fee = inputTotal - Number(output.value);
  if (fee <= 0) throw new Error("INVALID_OUTPUT");

  const vsize = Math.ceil(
    TX_OVERHEAD_VBYTES +
      txIds.length * INPUT_VBYTES +
      OUTPUT_BASE_VBYTES +
      output.script.length,
  );
  const maxFeeRate = Math.max(
    MIN_REFUND_FEE_RATE_CEILING,
    fastestFeeRate * REFUND_FEE_RATE_TOLERANCE,
  );
  if (fee > Math.ceil(vsize * maxFeeRate)) throw new Error("FEE_TOO_HIGH");
};
