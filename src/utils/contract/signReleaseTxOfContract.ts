import { Psbt } from "bitcoinjs-lib";
import { parseError } from "../parseError";
import { getEscrowWalletForOffer } from "../wallet/getEscrowWalletForOffer";
import { getNetwork } from "../wallet/getNetwork";
import { getSellOfferFromContract } from "./getSellOfferFromContract";
import { signBatchReleaseTransaction } from "./signBatchReleaseTransaction";
import { signReleaseTransaction } from "./signReleaseTransaction";

export const signReleaseTxOfContract = async (contract: Contract) => {
  const sellOffer = await getSellOfferFromContract(contract);
  const sellOfferId = sellOffer?.oldOfferId || sellOffer?.id;
  if (!sellOffer || !sellOfferId || !sellOffer?.funding)
    return { errorMsg: "SELL_OFFER_NOT_FOUND" };

  const wallet = getEscrowWalletForOffer(sellOffer);
  try {
    const releaseTransaction = signReleaseTransaction({
      psbt: Psbt.fromBase64(contract.releasePsbt, {
        network: getNetwork(),
      }),
      contract,
      sellOffer,
      wallet,
    });
    const batchReleasePsbt = contract.batchReleasePsbt
      ? signBatchReleaseTransaction({
          psbt: Psbt.fromBase64(contract.batchReleasePsbt, {
            network: getNetwork(),
          }),
          contract,
          sellOffer,
          wallet,
        })
      : undefined;

    return { releaseTransaction, batchReleasePsbt };
  } catch (e) {
    return { errorMsg: parseError(e) };
  }
};
