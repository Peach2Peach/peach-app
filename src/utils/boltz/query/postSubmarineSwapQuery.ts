import { peachLiquidWallet } from "../../wallet/setWallet";
import { postSubmarineSwap } from "../api/postSubmarineSwap";
import { BOLTZ_REFERRAL_CODE } from "../constants";

type Props = {
  from?: "BTC" | "L-BTC";
  to?: "BTC" | "L-BTC";
  invoice: string;
};
export const postSubmarineSwapQuery = async ({
  from = "L-BTC",
  to = "BTC",
  invoice,
}: Props) => {
  if (!peachLiquidWallet) throw Error('WALLET_NOT_READY')

  const keyPairIndex = peachLiquidWallet.internalAddresses.length + 1
  const keyPair = peachLiquidWallet.getInternalKeyPair(keyPairIndex);
  const { result, error: err } = await postSubmarineSwap({
    from,
    to,
    invoice,
    referralId: BOLTZ_REFERRAL_CODE,
    refundPublicKey: keyPair.publicKey.toString('hex'),
  });

  if (!result || err) throw new Error(err?.error || 'GENERAL_ERROR');

  return {
    swapInfo: result,
    keyPairIndex,
    keyPairWIF: keyPair.toWIF(),
  };
};
