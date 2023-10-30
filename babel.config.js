const suffix = process.env.NODE_ENV || process.env.APP_ENV || 'sandbox'

module.exports = (api) => {
  const path = `.env.${suffix}`
  api.cache(suffix !== 'sandbox')

  console.log('dotenv path: ', process.env.NODE_ENV, path)
  return {
    presets: [['module:metro-react-native-babel-preset', { useTransformReactJSXExperimmental: true }]],
    plugins: [
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
        },
      ],
      [
        'module:react-native-dotenv',
        {
          envName: 'BUNDLE',
          moduleName: '@env',
          path,
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: false,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
