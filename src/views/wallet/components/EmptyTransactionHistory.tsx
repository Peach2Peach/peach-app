import { Image, Platform, View } from "react-native";
import WebView from "react-native-webview";
import loadingAnimation from "../../../assets/animated/logo-rotate.gif";
import { PeachText } from "../../../components/text/PeachText";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

export const EmptyTransactionHistory = () => {
  const { isDarkMode } = useThemeStore();
  const gifUri = Image.resolveAssetSource(loadingAnimation).uri;
  const size = 128;
  return (
    <View style={tw`items-center justify-center h-full gap-8`}>
      {Platform.OS === "ios" ? (
        <Image
          source={loadingAnimation}
          style={tw`w-118px h-130px`}
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

      <PeachText
        style={tw`subtitle-1 ${isDarkMode ? "text-primary-mild-1" : "text-black-65"}`}
      >
        {i18n("wallet.transactionHistory.empty")}
      </PeachText>
    </View>
  );
};
