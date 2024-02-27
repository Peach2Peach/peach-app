import ecc from "@bitcoinerlab/secp256k1";
import { BOLTZ_API, NETWORK } from "@env";
import ECPairFactory from "ecpair";
import { View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { Loading } from "../../../../components/animation/Loading";
import tw from "../../../../styles/tailwind";
import { SubmarineAPIResponse } from "../../../../utils/boltz/api/postSubmarineSwap";
import { log } from "../../../../utils/log/log";
import { getLiquidNetwork } from "../../../../utils/wallet/getLiquidNetwork";
export const ECPair = ECPairFactory(ecc);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const html = require("boltz-swap-web-context");

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

  return `window.claimSubmarineSwap(${args}); void(0);`;
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
  const handleClaimMessage = (event: WebViewMessageEvent) => {
    log("ClaimSubmarineSwap - handleClaimMessage");

    const data = JSON.parse(event.nativeEvent.data);
    if (data.error) throw Error(data.error);
  };

  return (
    <View>
      <Loading />
      <WebView
        style={tw`absolute opacity-0`}
        source={html}
        originWhitelist={["*"]}
        injectedJavaScript={getClaimSubmarineSwapJS({
          invoice,
          swapInfo,
          keyPairWIF,
        })}
        onMessage={handleClaimMessage}
      />
    </View>
  );
};
