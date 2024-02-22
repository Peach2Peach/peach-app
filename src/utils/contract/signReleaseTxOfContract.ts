import { getError } from "../../../peach-api/src/utils/result";
import { Result } from "../../../peach-api/src/utils/result/types";
import { getEscrowWalletForOffer } from "../wallet/getEscrowWalletForOffer";
import { getSellOfferFromContract } from "./getSellOfferFromContract";
import { verifyAndSignReleaseTx } from "./verifyAndSignReleaseTx";

type ResultType = Result<
  {
    releaseTransaction: string;
    batchReleasePsbt?: string;
  },
  string | undefined
>;

export const signReleaseTxOfContract = async (contract: Contract): Promise<ResultType> => {
  const sellOffer = await getSellOfferFromContract(contract);
  const sellOfferId = sellOffer?.oldOfferId || sellOffer?.id;
  if (!sellOffer || !sellOfferId || !sellOffer?.funding)
    return getError("SELL_OFFER_NOT_FOUND")

  const wallet = getEscrowWalletForOffer(sellOffer);
  return verifyAndSignReleaseTx(contract, sellOffer, wallet)
};
