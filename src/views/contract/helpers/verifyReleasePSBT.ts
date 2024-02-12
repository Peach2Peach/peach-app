import { Psbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import { useConfigStore } from "../../../store/configStore/configStore";
import { txIdPartOfPSBT } from "../../../utils/bitcoin/txIdPartOfPSBT";
import { releaseTransactionHasValidOutputs } from "./releaseTransactionHasValidOutputs";

export const verifyReleasePSBT = (
  psbt: Psbt | LiquidPsbt,
  sellOffer?: SellOffer,
  contract?: Contract,
) => {
  if (!sellOffer) return "MISSING_DATA";
  const funding = psbt instanceof Psbt ? sellOffer.funding : sellOffer?.fundingLiquid
  if (!sellOffer || funding.txIds.length === 0 || !contract) return "MISSING_DATA";

  const txIds = funding.txIds;
  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    return "INVALID_INPUT";
  }

  if (
    psbt.txOutputs.every((output) => output.address !== contract.releaseAddress)
  ) {
    return "RETURN_ADDRESS_MISMATCH";
  }

  const { peachFee } = useConfigStore.getState();
  if (!releaseTransactionHasValidOutputs(psbt, contract, peachFee))
    return "INVALID_OUTPUT";

  return "";
};
