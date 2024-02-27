import { useQuery } from "@tanstack/react-query";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { SATSINBTC } from "../../../constants";
import { getRandom } from "../../crypto/getRandom";
import { round } from "../../math/round";
import { peachLiquidWallet } from "../../wallet/setWallet";
import { postReverseSubmarineSwap } from "../api/postReverseSubmarineSwap";
import { BOLTZ_REFERRAL_CODE } from "../constants";

const PREIMAGE_BYTES = 32;

const queryFn = async ({
  queryKey,
}: {
  queryKey: ["boltz", "reverse", string, string, string, number];
}) => {
  if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");
  const [, , from, to, address, amount] = queryKey;
  const preimage = await getRandom(PREIMAGE_BYTES);
  const keyPairIndex = peachLiquidWallet.internalAddresses.length + 1;
  const keyPair = peachLiquidWallet.getInternalKeyPair(keyPairIndex);
  const claimPublicKey = peachLiquidWallet
    .getInternalKeyPair(0)
    .publicKey.toString("hex");
  const { result, error: err } = await postReverseSubmarineSwap({
    from,
    to,
    preimageHash: sha256(preimage).toString("hex"),
    referralId: BOLTZ_REFERRAL_CODE,
    claimAddress: address,
    claimPublicKey,
    onchainAmount: round(amount * SATSINBTC),
  });

  if (err) throw new Error(err.error);
  return {
    swapInfo: result,
    keyPairIndex,
    keyPairWIF: keyPair.toWIF(),
    preimage: preimage.toString("hex"),
  };
};

type Props = {
  from?: "BTC" | "L-BTC";
  to?: "BTC" | "L-BTC";
  address: string;
  amount: number;
};

export const usePostReverseSubmarineSwap = ({
  from = "BTC",
  to = "L-BTC",
  address,
  amount,
}: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["boltz", "reverse", from, to, address, amount],
    queryFn,
    staleTime: Infinity,
  });
  return { data, isLoading, error };
};
