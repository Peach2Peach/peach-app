import { isBuyerOnlyEscrow } from "../offer/isBuyerOnlyEscrow";
import { peachAPI } from "../peachAPI";
import { createBuyerOnlyEscrowReleaseTx } from "../wallet/createBuyerOnlyEscrowReleaseTx";
import { getBuyerOnlyEscrowWallet } from "./getBuyerOnlyEscrowWallet";
import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

const MIN_FEE_RATE = 1;

/**
 * @description the signed release the buyer has to send when marking the
 * payment as made on an escrowVersion 3 contract, undefined on any other.
 *
 * Reads a fresh contract on purpose: the Peach fee address changes over time.
 */
export const getBuyerOnlyEscrowReleaseTx = async ({
  contractId,
  releaseAddress,
}: {
  contractId: string;
  /** a release address that is new to the contract, if there is one */
  releaseAddress?: string;
}) => {
  const { result: contract, error: contractError } =
    await peachAPI.private.contract.getContract({ contractId });
  if (!contract) throw new Error(contractError?.error || "MISSING_DATA");
  if (!isBuyerOnlyEscrow(contract)) return undefined;

  const finalReleaseAddress = releaseAddress ?? contract.releaseAddress;
  const { buyerOnlyEscrowRelease: release } = contract;
  if (!release || !finalReleaseAddress) throw new Error("MISSING_DATA");

  // the buyer signs this themselves, so don't take the server's word for the fee
  const expectedPeachFee =
    contract.buyerFee > 0 ? Math.ceil(contract.amount * contract.buyerFee) : 0;
  if (release.peachFeeSats !== expectedPeachFee) {
    throw new Error("INVALID_PEACH_FEE");
  }

  const wallet = getBuyerOnlyEscrowWallet(contract);

  const [{ result: funding, error: fundingError }, { result: fees }] =
    await Promise.all([
      peachAPI.private.offer.getFundingStatus({
        offerId: getSellOfferIdFromContract(contract),
      }),
      peachAPI.public.bitcoin.getFeeEstimate(),
    ]);
  if (!funding) throw new Error(fundingError?.error || "MISSING_DATA");
  if (!fees) throw new Error("MISSING_DATA");

  return createBuyerOnlyEscrowReleaseTx({
    wallet,
    funding: funding.funding,
    releaseAddress: finalReleaseAddress,
    peachFeeAddress: release.peachFeeAddress,
    peachFeeSats: release.peachFeeSats,
    feeRate: Math.max(MIN_FEE_RATE, Math.ceil(fees.halfHourFee)),
  });
};
