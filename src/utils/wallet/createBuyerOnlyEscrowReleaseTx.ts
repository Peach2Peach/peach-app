import { BIP32Interface } from "bip32";
import { Psbt } from "bitcoinjs-lib";
import { ESCROW_VERSION } from "../../../peach-api";
import { getNetwork } from "./getNetwork";
import { signAndFinalizeEscrowPSBT } from "./signEscrowPSBT";
import { getSingleSigEscrowScript, toXOnly } from "./singleSigEscrow";

const DUST_LIMIT = 546;

type Params = {
  /** the key of the Buy Offer the contract came from */
  wallet: BIP32Interface;
  funding: Pick<FundingStatus, "txIds" | "vouts" | "amounts">;
  releaseAddress: string;
  peachFeeAddress?: string;
  peachFeeSats: number;
  /** sat/vB */
  feeRate: number;
};

/**
 * @description builds and signs the transaction that pays out an escrowVersion
 * 3 escrow. The server stores it and broadcasts it when the seller confirms.
 * The payout output pays the mining fee.
 */
export const createBuyerOnlyEscrowReleaseTx = ({
  wallet,
  funding: { txIds, vouts, amounts },
  releaseAddress,
  peachFeeAddress,
  peachFeeSats,
  feeRate,
}: Params) => {
  if (
    txIds.length === 0 ||
    txIds.length !== vouts.length ||
    txIds.length !== amounts.length
  ) {
    throw Error("MISSING_DATA");
  }
  if (peachFeeSats > 0 && !peachFeeAddress) throw Error("MISSING_DATA");

  const script = getSingleSigEscrowScript(wallet.publicKey);
  const tapInternalKey = toXOnly(wallet.publicKey);
  const total = amounts.reduce((sum, amount) => sum + amount, 0);

  const buildSignedTx = (miningFee: number) => {
    const payout = total - peachFeeSats - miningFee;
    if (payout <= DUST_LIMIT) throw Error("INSUFFICIENT_FUNDS");

    const psbt = new Psbt({ network: getNetwork() });
    txIds.forEach((txId, i) => {
      psbt.addInput({
        hash: txId,
        index: vouts[i],
        witnessUtxo: { script, value: amounts[i] },
        tapInternalKey,
      });
    });
    psbt.addOutput({ address: releaseAddress, value: payout });
    if (peachFeeSats > 0 && peachFeeAddress) {
      psbt.addOutput({ address: peachFeeAddress, value: peachFeeSats });
    }
    // same key path spend as a version 2 escrow, just with the buyer's key
    return signAndFinalizeEscrowPSBT(psbt, wallet, {
      escrowVersion: ESCROW_VERSION,
    });
  };

  // the output values don't change the size, so a first pass gives the exact one
  const miningFee = Math.ceil(buildSignedTx(0).virtualSize() * feeRate);
  return buildSignedTx(miningFee).toHex();
};
