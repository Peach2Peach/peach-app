import { useQuery } from "@tanstack/react-query";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { SATSINBTC } from "../../../constants";
import { getRandom } from "../../crypto/getRandom";
import { round } from "../../math/round";
import { peachLiquidWallet } from "../../wallet/setWallet";
import { postReverseSubmarineSwap } from "../api/postReverseSubmarineSwap";

const PREIMAGE_BYTES = 32

const queryFn = async ({ queryKey }: { queryKey: ['boltz', 'reverse', string, string, string, number] }) => {
  const [,, from, to, address, amount] = queryKey
  const preimage = await getRandom(PREIMAGE_BYTES)
  const keyPair = peachLiquidWallet.getInternalKeyPair(0) // TODO get unused keypair
  const claimPublicKey = peachLiquidWallet.getInternalKeyPair(0).publicKey.toString('hex')
  const { result, error: err } =
    await postReverseSubmarineSwap({
      from,
      to,
      preimageHash: sha256(preimage).toString('hex'),
      referralId: 'peach', // TODO set real ref code
      claimAddress: address,
      claimPublicKey,
      onchainAmount: round(amount * SATSINBTC),
    });

  if (err) throw new Error(err.error);
  return { swapInfo: result, keyPairWIF: keyPair.toWIF(), preimage: preimage.toString('hex') };
}


type Props = {
  from?: 'BTC' | 'L-BTC'
  to?: 'BTC' | 'L-BTC'
  address: string
  amount: number
}

export const usePostReverseSubmarineSwap = ({ from = 'BTC', to = 'L-BTC', address, amount }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['boltz', 'reverse', from, to, address, amount],
    queryFn,
    staleTime: Infinity,
  })
  return { data, isLoading, error }
}
