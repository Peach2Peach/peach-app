import { Psbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { getSellOfferFunding } from "../offer/getSellOfferFunding";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import { txIdPartOfPSBT } from "./txIdPartOfPSBT";


  // refunds should only have one output on bitcoin but 2 on liquid (mining fees are explicit)
const EXPECTED_OUTPUTS = {
  bitcoin: 1,
  liquid: 2,
}


type Props = {
  psbt: Psbt | LiquidPsbt,
  sellOffer: SellOffer,
}
const checkRefundPSBTBase = ({psbt, sellOffer}: Props): {
  isValid: boolean;
  psbt: Psbt | LiquidPsbt;
  err?: string | null;
} => {
  if (!sellOffer?.id) return { isValid: false, psbt, err: "NOT_FOUND" };

  const funding = getSellOfferFunding(sellOffer)
  if (!psbt || !funding?.txIds) return { isValid: false, psbt, err: "NOT_FOUND" };

  // Don't trust the response, verify
  const txIds = funding.txIds;
  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    return { isValid: false, psbt, err: "INVALID_INPUT" };
  }

  if (psbt.txOutputs.length > EXPECTED_OUTPUTS[sellOffer.escrowType]) return {
    isValid: false, psbt, err: "INVALID_OUTPUT"
  };
  if (
    psbt.txOutputs[0].address?.toLowerCase() !==
    sellOffer.returnAddress?.toLowerCase()
  ) {
    return { isValid: false, psbt, err: "RETURN_ADDRESS_MISMATCH" };
  }
  return { isValid: true, psbt };
};

export const checkRefundPSBT = (
  psbtBase64: string,
  sellOffer: SellOffer,
) => sellOffer.escrowType === 'liquid'
  ? checkRefundPSBTBase({sellOffer, psbt: LiquidPsbt.fromBase64(psbtBase64, { network: getLiquidNetwork() })})
  : checkRefundPSBTBase({sellOffer, psbt: Psbt.fromBase64(psbtBase64, { network: getNetwork() })})
