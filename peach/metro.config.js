/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    server: {
      port: 9091,
    },
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  },
  resolver: {
    extraNodeModules: {
      stream: require.resolve('readable-stream'),
      crypto: require.resolve('react-native-crypto'),
      path: require.resolve('path-browserify'),
      fs: require.resolve('react-native-level-fs'),
      // _stream_transform: require.resolve('readable-stream/transform'),
      // _stream_readable: require.resolve('readable-stream/readable'),
      // _stream_writable: require.resolve('readable-stream/writable'),
      // _stream_duplex: require.resolve('readable-stream/duplex'),
      // _stream_passthrough: require.resolve('readable-stream/passthrough'),
    }
  },
}
