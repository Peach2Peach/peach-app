import { Image, Platform, View } from "react-native";
import bitcoinAnimation from "../../assets/animated/bitcoin.gif";

import WebView from "react-native-webview";
import { PeachText } from "../../components/text/PeachText";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
type Props = {
  text?: string;
};
export const BitcoinLoading = ({ text }: Props) => {
  const { isDarkMode } = useThemeStore();

  const gifUri = Image.resolveAssetSource(bitcoinAnimation).uri;
  const size = 128;
  return (
    <View style={tw`items-center justify-center flex-1 gap-8`}>
      <View style={tw`pr-6px`}>
        {Platform.OS === "ios" ? (
          <Image
            source={bitcoinAnimation}
            style={tw`w-32 h-32`}
            resizeMode="cover"
          />
        ) : (
          <WebView
            originWhitelist={["*"]}
            scrollEnabled={false}
            androidLayerType="software"
            style={{
              width: size,
              height: size,
              backgroundColor: "transparent",
              flex: 0,
              overflow: "hidden",
            }}
            containerStyle={{
              flex: 0,
              overflow: "hidden",
              backgroundColor: "transparent",
            }}
            source={{
              html: `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0">
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  background: transparent;
                  overflow: hidden;
                  width: 100%;
                  height: 100%;
                }
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  display: block;
                }
              </style>
            </head>
            <body>
              <img src="${gifUri}" />
            </body>
          </html>
        `,
            }}
          />
        )}
      </View>
      <PeachText
        style={[
          tw`text-center subtitle-1`,
          isDarkMode ? tw`text-primary-mild-1` : tw`text-black-100`,
        ]}
      >
        {text || i18n("loading")}
      </PeachText>
    </View>
  );
};
