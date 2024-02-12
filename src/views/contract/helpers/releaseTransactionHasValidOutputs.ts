import { Psbt, PsbtTxOutput } from "bitcoinjs-lib";
import { ElementsValue } from "liquidjs-lib";
import { Psbt as LiquidPsbt, PsbtTxOutput as LiquidPsbtTxOutput } from "liquidjs-lib/src/psbt";
import { ceil } from "../../../utils/math/ceil";
import { isPSBTForBatch } from "./isPSBTForBatch";

const isLiquidTxOutput = (txOutput: PsbtTxOutput | LiquidPsbtTxOutput): txOutput is LiquidPsbtTxOutput => txOutput.value instanceof Buffer

const EXPECTED_OUTPUTS = {
  BITCOIN: {
    WITH_FEE: 2,
  },
  LIQUID: {
    WITH_FEE: 3,
  },
}

/**
 * @description Check if buyer receives agreed amount minus peach fees
 */
export const releaseTransactionHasValidOutputs = (
  psbt: Psbt | LiquidPsbt,
  contract: Contract,
  peachFee: number,
) => {
  const isLiquid = psbt instanceof LiquidPsbt
  const NETWORK = isLiquid ? 'LIQUID' : 'BITCOIN'
  const batchMode = !isLiquid ? isPSBTForBatch(psbt) : false;
  const buyerFee = contract.buyerFee ?? peachFee;
  const buyerOutput = psbt.txOutputs.find(
    (output) => output.address === contract.releaseAddress,
  );
  const peachFeeOutput = psbt.txOutputs.find(
    (output) => output.address !== contract.releaseAddress,
  );

  if (buyerFee > 0 && psbt.txOutputs.length > EXPECTED_OUTPUTS[NETWORK].WITH_FEE) return false;

  if (!buyerOutput) return false;

  if ((buyerFee === 0 || batchMode) && psbt.txOutputs.length !== 1)
    return false;


  if (buyerFee > 0 && !batchMode) {
    if (!peachFeeOutput) return false
    const outputValue = isLiquidTxOutput(peachFeeOutput) ? ElementsValue.fromBytes(peachFeeOutput.value).number: peachFeeOutput.value
    if (outputValue !== ceil(contract.amount * buyerFee) || buyerOutput.value === 0) {
      return false;
    }
    return true;
  }

  return true;
};
