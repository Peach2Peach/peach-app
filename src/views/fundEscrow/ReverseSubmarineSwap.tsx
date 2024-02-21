import ecc from "@bitcoinerlab/secp256k1";
import { BOLTZ_API, NETWORK } from "@env";
import ECPairFactory from "ecpair";
import { useEffect } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { Loading } from "../../components/animation/Loading";
import { LightningInvoice } from "../../components/bitcoin/LightningInvoice";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { useLiquidFeeRate } from "../../hooks/useLiquidFeeRate";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import tw from "../../styles/tailwind";
import { ReverseResponse, SwapStatus } from "../../utils/boltz/api/types";
import { useClaimReverseSubmarineSwap } from "../../utils/boltz/query/useClaimReverseSubmarineSwap";
import { usePostReverseSubmarineSwap } from "../../utils/boltz/query/usePostReverseSubmarineSwap";
import { useSwapStatus } from "../../utils/boltz/query/useSwapStatus";
import { getLiquidNetwork } from "../../utils/wallet/getLiquidNetwork";

const ECPair = ECPairFactory(ecc)


// TODO document this workaround
const html = require("boltz-swap-web-context");

type GetClaimReverseSubmarineSwapJSProps = {
  address: string,
  feeRate: number,
  swapInfo: ReverseResponse
  swapStatus: SwapStatus,
  keyPairWIF: string
  preimage: string
}
const getClaimReverseSubmarineSwapJS = ({ address, feeRate, swapInfo, swapStatus, keyPairWIF, preimage }: GetClaimReverseSubmarineSwapJSProps) => {
  const { refundPublicKey, swapTree } = swapInfo
  if (!refundPublicKey || !swapTree) throw Error('GENERAL_ERROR')
  if (!swapStatus.transaction?.hex) throw Error('LOCK_TRANSACTION_MISSING')
  const keyPair = ECPair.fromWIF(keyPairWIF, getLiquidNetwork())

  const args = JSON.stringify({
    apiUrl: BOLTZ_API,
    network: NETWORK === 'bitcoin' ? 'liquid' : NETWORK,
    address,
    feeRate,
    swapInfo,
    privateKey: keyPair.privateKey?.toString('hex'),
    preimage
  })

  return `window.claimReverseSubmarineSwap(${args}); void(0);`
}

type ClaimReverseSubmarineSwapProps = {
  offerId: string
  address: string,
  swapInfo: ReverseResponse
  swapStatus: SwapStatus,
  keyPairWIF: string
  preimage: string
}
const ClaimReverseSubmarineSwap = (
  { offerId, swapInfo, address, swapStatus, keyPairWIF, preimage }: ClaimReverseSubmarineSwapProps
) => {
  const feeRate = useLiquidFeeRate()
  const { error: claimError, handleClaimMessage } = useClaimReverseSubmarineSwap({ offerId })

  if (claimError) return <ErrorBox>{claimError}</ErrorBox>

  return <View>
    <Loading />
    <WebView
      style={tw`absolute opacity-0`}
      source={html}
      originWhitelist={['*']}
      injectedJavaScript={getClaimReverseSubmarineSwapJS({
        address, feeRate, swapInfo, swapStatus, keyPairWIF, preimage
      })}
      onMessage={handleClaimMessage}
    />
  </View>
}

export type Props = {
  offerId: string
  address: string
  amount: number
};

export const ReverseSubmarineSwap = ({ offerId, address, amount }: Props) => {
  const { data, error } = usePostReverseSubmarineSwap({
    address,
    amount,
  })
  const swapInfo = data?.swapInfo
  const { status } = useSwapStatus({ id: swapInfo?.id })
  const saveSwap = useBoltzSwapStore(state => state.saveSwap)

  useEffect(()=> {
    if (data?.swapInfo) saveSwap(offerId, data?.swapInfo)
  }, [data?.swapInfo, offerId, saveSwap])

  if (error?.message) return <ErrorBox>{error.message}</ErrorBox>
  if (!swapInfo?.invoice ) return <Loading />

  if (data && status?.status === 'transaction.mempool') return <ClaimReverseSubmarineSwap
    offerId={offerId}
    address={address}
    swapInfo={swapInfo}
    swapStatus={status}
    keyPairWIF={data.keyPairWIF}
    preimage={data.preimage}
  />

  return <LightningInvoice invoice={swapInfo.invoice}/>;
};

