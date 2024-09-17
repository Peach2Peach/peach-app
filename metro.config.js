const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig();
const config = {
  resetCache: true,
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg", "cjs"],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
