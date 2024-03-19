import ecc from "@bitcoinerlab/secp256k1";
import { BOLTZ_API, NETWORK } from "@env";
import { SwapStatus } from "boltz-swap-web-context/src/boltz-api/types";
import ECPairFactory from "ecpair";
import { WebView } from "react-native-webview";
import { getError } from "../../../../peach-api/src/utils/result/getError";
import { getResult } from "../../../../peach-api/src/utils/result/getResult";
import { ErrorBox } from "../../../components/ui/ErrorBox";
import { useBoltzWebcontext } from "../../../hooks/query/useBoltzWebcontext";
import { useLiquidFeeRate } from "../../../hooks/useLiquidFeeRate";
import tw from "../../../styles/tailwind";
import { ReverseAPIResponse } from "../../../utils/boltz/api/postReverseSubmarineSwap";
import { useClaimReverseSubmarineSwap } from "../../../utils/boltz/query/useClaimReverseSubmarineSwap";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
export const ECPair = ECPairFactory(ecc);

type GetClaimReverseSubmarineSwapJSProps = {
  address: string;
  feeRate: number;
  swapInfo: ReverseAPIResponse;
  swapStatus: SwapStatus;
  keyPairWIF: string;
  preimage: string;
};
const getClaimReverseSubmarineSwapJS = ({
  address,
  feeRate,
  swapInfo,
  swapStatus,
  keyPairWIF,
  preimage,
}: GetClaimReverseSubmarineSwapJSProps) => {
  const { refundPublicKey, swapTree } = swapInfo;
  if (!refundPublicKey || !swapTree) return getError("GENERAL_ERROR");
  if (!swapStatus.transaction?.hex) return getError("LOCK_TRANSACTION_MISSING");
  const keyPair = ECPair.fromWIF(keyPairWIF, getLiquidNetwork());

  const args = JSON.stringify({
    apiUrl: BOLTZ_API,
    network: NETWORK === "bitcoin" ? "liquid" : NETWORK,
    address,
    feeRate,
    swapInfo,
    privateKey: keyPair.privateKey?.toString("hex"),
    preimage,
  });

  return getResult(`window.claimReverseSubmarineSwap(${args}); void(0);`);
};

export type ClaimReverseSubmarineSwapProps = {
  offerId: string;
  address: string;
  swapInfo: ReverseAPIResponse;
  swapStatus: SwapStatus;
  keyPairWIF: string;
  preimage: string;
};

/**
 * @description Because react-native does not support WebAssembly but is needed to claim swaps
 * this component includes a Webview to execute WebAssembly dependent code.
 * We simply inject a function call with the right arguments from the react-native layer
 * and listen for success or error messages from the web context.
 */
export const ClaimReverseSubmarineSwap = ({
  offerId,
  swapInfo,
  address,
  swapStatus,
  keyPairWIF,
  preimage,
}: ClaimReverseSubmarineSwapProps) => {
  const feeRate = useLiquidFeeRate();
  const { error: claimError, handleClaimMessage } =
    useClaimReverseSubmarineSwap({ offerId });

  const { data: html, error: htmlError } = useBoltzWebcontext();
  const injectedJavaScript = getClaimReverseSubmarineSwapJS({
    address,
    feeRate,
    swapInfo,
    swapStatus,
    keyPairWIF,
    preimage,
  });

  if (claimError || htmlError || !injectedJavaScript.isOk())
    return (
      <ErrorBox>
        {claimError || htmlError?.message || injectedJavaScript.getError()}
      </ErrorBox>
    );

  if (!html) return <></>;
  return (
    <WebView
      style={tw`absolute opacity-0`}
      source={{ html }}
      originWhitelist={["*"]}
      injectedJavaScript={injectedJavaScript.getValue()}
      javaScriptEnabled={true}
      onMessage={handleClaimMessage}
    />
  );
};
