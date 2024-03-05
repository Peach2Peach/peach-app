import ecc from "@bitcoinerlab/secp256k1";
import { BOLTZ_API, NETWORK } from "@env";
import ECPairFactory from "ecpair";
import { useMemo } from "react";
import { View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { getResult } from "../../../../../peach-api/src/utils/result/getResult";
import { Loading } from "../../../../components/animation/Loading";
import { ErrorBox } from "../../../../components/ui/ErrorBox";
import { useBoltzWebcontext } from "../../../../hooks/query/useBoltzWebcontext";
import tw from "../../../../styles/tailwind";
import { SubmarineAPIResponse } from "../../../../utils/boltz/api/postSubmarineSwap";
import { log } from "../../../../utils/log/log";
import { getLiquidNetwork } from "../../../../utils/wallet/getLiquidNetwork";
export const ECPair = ECPairFactory(ecc);

type GetClaimSubmarineSwapJSProps = {
  invoice: string;
  swapInfo: SubmarineAPIResponse;
  keyPairWIF: string;
};
const getClaimSubmarineSwapJS = ({
  invoice,
  swapInfo,
  keyPairWIF,
}: GetClaimSubmarineSwapJSProps) => {
  const keyPair = ECPair.fromWIF(keyPairWIF, getLiquidNetwork());

  const args = JSON.stringify({
    apiUrl: BOLTZ_API,
    network: NETWORK === "bitcoin" ? "liquid" : NETWORK,
    invoice,
    swapInfo,
    privateKey: keyPair.privateKey?.toString("hex"),
  });

  return getResult(`window.claimSubmarineSwap(${args}); void(0);`);
};

type ClaimSubmarineSwapProps = {
  invoice: string;
  swapInfo: SubmarineAPIResponse;
  keyPairWIF: string;
};

/**
 * @description Because react-native does not support WebAssembly but is needed to claim swaps
 * this component includes a Webview to execute WebAssembly dependent code.
 * We simply inject a function call with the right arguments from the react-native layer
 * and listen for success or error messages from the web context.
 */
export const ClaimSubmarineSwap = ({
  swapInfo,
  invoice,
  keyPairWIF,
}: ClaimSubmarineSwapProps) => {
  const { data: html, error: htmlError } = useBoltzWebcontext();
  const injectedJavaScript = useMemo(
    () =>
      getClaimSubmarineSwapJS({
        invoice,
        swapInfo,
        keyPairWIF,
      }),
    [invoice, keyPairWIF, swapInfo],
  );
  const handleClaimMessage = (event: WebViewMessageEvent) => {
    log("ClaimSubmarineSwap - handleClaimMessage");

    const data = JSON.parse(event.nativeEvent.data);
    if (data.error) throw Error(data.error);
  };

  if (htmlError || !injectedJavaScript.isOk())
    return (
      <ErrorBox>{htmlError?.message || injectedJavaScript.getError()}</ErrorBox>
    );

  return (
    <View>
      <Loading />
      {!!html && (
        <WebView
          style={tw`absolute opacity-0`}
          source={{ html }}
          originWhitelist={["*"]}
          injectedJavaScript={injectedJavaScript.getValue()}
          onMessage={handleClaimMessage}
        />
      )}
    </View>
  );
};
