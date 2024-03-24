import { BIP32Interface } from "bip32";
import { Psbt as BitcoinPsbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import {
  getError,
  getResult,
  parseError,
} from "../../../peach-api/src/utils/result";
import { Result } from "../../../peach-api/src/utils/result/types";
import { isLiquidAddress } from "../validation/rules";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import { getNetwork } from "../wallet/getNetwork";
import { signBatchReleaseTransaction } from "./signBatchReleaseTransaction";
import { signReleaseTransaction } from "./signReleaseTransaction";

type Props = {
  contract: Contract;
  sellOffer: SellOffer;
  wallet: BIP32Interface;
};
type BitcoinProps = Props & {
  psbt: BitcoinPsbt;
  batchPsbt?: BitcoinPsbt;
};
type LiquidProps = Props & {
  psbt: LiquidPsbt;
  batchPsbt?: LiquidPsbt;
};
type ResultType = Result<
  {
    releaseTransaction: string;
    batchReleasePsbt?: string;
  },
  string | undefined
>;

function verifyAndSignReleaseTxBase(props: BitcoinProps): ResultType;
function verifyAndSignReleaseTxBase(props: LiquidProps): ResultType;
function verifyAndSignReleaseTxBase({
  contract,
  sellOffer,
  wallet,
  psbt,
  batchPsbt,
}: BitcoinProps | LiquidProps): ResultType {
  const sellOfferId = sellOffer.oldOfferId || sellOffer.id;
  if (!sellOfferId || !sellOffer?.funding)
    return getError("SELL_OFFER_NOT_FOUND");

  try {
    const releaseTransaction = signReleaseTransaction({
      psbt,
      contract,
      sellOffer,
      wallet,
    });
    const batchReleasePsbt = batchPsbt
      ? signBatchReleaseTransaction({
          psbt: batchPsbt,
          contract,
          sellOffer,
          wallet,
        })
      : undefined;

    return getResult({ releaseTransaction, batchReleasePsbt });
  } catch (e) {
    return getError(parseError(e));
  }
}

export const verifyAndSignReleaseTx = (
  contract: Contract,
  sellOffer: SellOffer,
  wallet: BIP32Interface,
) =>
  isLiquidAddress(contract.releaseAddress, getLiquidNetwork())
    ? verifyAndSignReleaseTxBase({
        contract,
        sellOffer,
        wallet,
        psbt: LiquidPsbt.fromBase64(contract.releasePsbt, {
          network: getLiquidNetwork(),
        }),
      })
    : verifyAndSignReleaseTxBase({
        contract,
        sellOffer,
        wallet,
        psbt: BitcoinPsbt.fromBase64(contract.releasePsbt, {
          network: getNetwork(),
        }),
        batchPsbt: contract.batchReleasePsbt
          ? BitcoinPsbt.fromBase64(contract.batchReleasePsbt, {
              network: getNetwork(),
            })
          : undefined,
      });
