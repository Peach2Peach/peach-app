import ecc from "@bitcoinerlab/secp256k1";
import { BOLTZ_API, NETWORK } from "@env";
import ECPairFactory from "ecpair";
import { WebView } from "react-native-webview";
import { getError } from "../../../../../peach-api/src/utils/result/getError";
import { getResult } from "../../../../../peach-api/src/utils/result/getResult";
import { ErrorBox } from "../../../../components/ui/ErrorBox";
import { useBoltzWebcontext } from "../../../../hooks/query/useBoltzWebcontext";
import { useLiquidFeeRate } from "../../../../hooks/useLiquidFeeRate";
import { SwapInfo } from "../../../../store/useBoltzSwapStore";
import tw from "../../../../styles/tailwind";
import { useRefundSubmarineSwap } from "../../../../utils/boltz/query/useRefundSubmarineSwap";
import { getLiquidNetwork } from "../../../../utils/wallet/getLiquidNetwork";
export const ECPair = ECPairFactory(ecc);

type GetRefundSwapJSProps = {
  address: string;
  feeRate: number;
  swapInfo: SwapInfo;
  keyPairWIF: string;
};
const getRefundSubmarineSwapJS = ({
  address,
  feeRate,
  swapInfo,
  keyPairWIF,
}: GetRefundSwapJSProps) => {
  if (!("claimPublicKey" in swapInfo) || !swapInfo.swapTree)
    return getError("GENERAL_ERROR");
  const keyPair = ECPair.fromWIF(keyPairWIF, getLiquidNetwork());

  const args = JSON.stringify({
    apiUrl: BOLTZ_API,
    network: NETWORK === "bitcoin" ? "liquid" : NETWORK,
    address,
    feeRate,
    swapInfo,
    privateKey: keyPair.privateKey?.toString("hex"),
  });

  return getResult(`window.refundSubmarineSwap(${args}); void(0);`);
};

export type RefundSubmarineSwapProps = {
  address: string;
  swapInfo: SwapInfo;
  keyPairWIF: string;
};

/**
 * @description Because react-native does not support WebAssembly but is needed to claim swaps
 * this component includes a Webview to execute WebAssembly dependent code.
 * We simply inject a function call with the right arguments from the react-native layer
 * and listen for success or error messages from the web context.
 */
export const RefundSubmarineSwap = ({
  swapInfo,
  address,
  keyPairWIF,
}: RefundSubmarineSwapProps) => {
  const feeRate = useLiquidFeeRate();
  const { error: refundError, handleRefundMessage } = useRefundSubmarineSwap({
    swap: swapInfo,
  });

  const { data: html, error: htmlError } = useBoltzWebcontext();
  const injectedJavaScript = getRefundSubmarineSwapJS({
    address,
    feeRate,
    swapInfo,
    keyPairWIF,
  });

  if (refundError || htmlError || !injectedJavaScript.isOk())
    return (
      <ErrorBox>
        {refundError || htmlError?.message || injectedJavaScript.getError()}
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
      onMessage={handleRefundMessage}
    />
  );
};
