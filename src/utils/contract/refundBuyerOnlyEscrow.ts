import { Psbt } from "bitcoinjs-lib";
import { ESCROW_VERSION } from "../../../peach-api";
import { useAccountStore } from "../account/account";
import { isBuyerOnlyEscrow } from "../offer/isBuyerOnlyEscrow";
import { peachAPI } from "../peachAPI";
import { getNetwork } from "../wallet/getNetwork";
import { signAndFinalizeEscrowPSBT } from "../wallet/signEscrowPSBT";
import { getBuyerOnlyEscrowWallet } from "./getBuyerOnlyEscrowWallet";
import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

/**
 * refunded: signed and submitted
 * notDue: nothing to do right now, but it may still become due
 * never: this contract will never need a refund from us
 */
export type BuyerOnlyEscrowRefundResult = "refunded" | "notDue" | "never";

/**
 * @description whether a contract is in the one state where the buyer must
 * refund the seller's escrowVersion 3 escrow. A contract whose payment is late
 * or whose cancelation is only requested is not canceled yet: the seller may
 * still give the buyer more time, so we must not refund it.
 */
export const isBuyerOnlyEscrowRefundCandidate = (
  contract: Pick<
    Contract,
    | "escrowVersion"
    | "canceled"
    | "buyer"
    | "disputeActive"
    | "disputeWinner"
    | "releaseTxId"
    | "escrow"
  >,
  publicKey: string,
) =>
  isBuyerOnlyEscrow(contract) &&
  contract.canceled === true &&
  !!publicKey &&
  contract.buyer.id === publicKey &&
  !contract.disputeActive &&
  // precaution: if the buyer won a dispute, the sats are theirs, so a refund
  // to the seller is never signed automatically
  contract.disputeWinner !== "buyer" &&
  !contract.releaseTxId &&
  !!contract.escrow;

const inFlight = new Map<string, Promise<BuyerOnlyEscrowRefundResult>>();

/**
 * @description signs the refund of a canceled escrowVersion 3 contract, which
 * only the buyer can do. Every caller (contract screen, app open, push) goes
 * through here, so the checks can't be skipped. Calls for the same contract
 * share one run, so the refund is never signed twice at once.
 */
export const refundBuyerOnlyEscrow = (contractId: string) => {
  const running = inFlight.get(contractId);
  if (running) return running;

  const run = signRefund(contractId).finally(() => inFlight.delete(contractId));
  inFlight.set(contractId, run);
  return run;
};

async function signRefund(
  contractId: string,
): Promise<BuyerOnlyEscrowRefundResult> {
  // never trust a cached contract: the state may have changed since
  const { result: contract, error: contractError } =
    await peachAPI.private.contract.getContract({ contractId });
  if (!contract) throw new Error(contractError?.error || "MISSING_DATA");

  const { publicKey } = useAccountStore.getState().account;
  // "never" is remembered for good, so only answer it when we know for sure
  if (!publicKey) return "notDue";
  if (
    !isBuyerOnlyEscrow(contract) ||
    contract.buyer.id !== publicKey ||
    contract.disputeWinner === "buyer" ||
    !!contract.releaseTxId
  ) {
    return "never";
  }
  if (!isBuyerOnlyEscrowRefundCandidate(contract, publicKey)) return "notDue";

  const wallet = getBuyerOnlyEscrowWallet(contract);

  // the PSBT is fetched right before signing because the server only accepts
  // a transaction matching the latest one
  const [{ result, error: psbtError }, { result: funding, error: fundingError }] =
    await Promise.all([
      peachAPI.private.contract.getBuyerOnlyEscrowRefundPsbt({ contractId }),
      peachAPI.private.offer.getFundingStatus({
        offerId: getSellOfferIdFromContract(contract),
      }),
    ]);
  // the server answers FORBIDDEN when no refund is due
  if (psbtError?.error === "FORBIDDEN") return "notDue";
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
    contractId,
    tx: tx.toHex(),
  });
  if (error?.error === "FORBIDDEN") return "notDue";
  if (error) throw new Error(error.error);
  return "refunded";
}
