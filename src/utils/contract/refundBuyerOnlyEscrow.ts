import { Psbt } from "bitcoinjs-lib";
import { ESCROW_VERSION } from "../../../peach-api";
import { peachAPI } from "../peachAPI";
import { getNetwork } from "../wallet/getNetwork";
import { signAndFinalizeEscrowPSBT } from "../wallet/signEscrowPSBT";
import { getBuyerOnlyEscrowWallet } from "./getBuyerOnlyEscrowWallet";
import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

/**
 * @description signs the refund of a canceled escrowVersion 3 contract, which
 * only the buyer can do. The PSBT is fetched right before signing because the
 * server only accepts a transaction matching the latest one.
 */
export const refundBuyerOnlyEscrow = async (
  contract: Pick<Contract, "id" | "buyOffer69Id" | "escrow">,
) => {
  const wallet = getBuyerOnlyEscrowWallet(contract);

  const [{ result, error: psbtError }, { result: funding, error: fundingError }] =
    await Promise.all([
      peachAPI.private.contract.getBuyerOnlyEscrowRefundPsbt({
        contractId: contract.id,
      }),
      peachAPI.private.offer.getFundingStatus({
        offerId: getSellOfferIdFromContract(contract),
      }),
    ]);
  if (!result?.psbt) throw new Error(psbtError?.error || "MISSING_DATA");
  if (!funding) throw new Error(fundingError?.error || "MISSING_DATA");

  const psbt = Psbt.fromBase64(result.psbt, { network: getNetwork() });
  const [output, ...otherOutputs] = psbt.txOutputs;
  if (otherOutputs.length > 0 || output?.address !== funding.returnAddress) {
    throw new Error("RETURN_ADDRESS_MISMATCH");
  }

  // same key path spend as a version 2 escrow, just with the buyer's key
  const tx = signAndFinalizeEscrowPSBT(psbt, wallet, {
    escrowVersion: ESCROW_VERSION,
  });

  const { error } = await peachAPI.private.contract.postBuyerOnlyEscrowRefund({
    contractId: contract.id,
    tx: tx.toHex(),
  });
  if (error) throw new Error(error.error);
};
