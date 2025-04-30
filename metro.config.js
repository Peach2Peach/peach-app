const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://reactnative.dev/docs/next/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resetCache: true,
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: ["bin", "cjs", "mp4", "jpg", "png", "ttf", "wav", "mp3"],
    sourceExts: ["js", "jsx", "ts", "tsx", "json"],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
