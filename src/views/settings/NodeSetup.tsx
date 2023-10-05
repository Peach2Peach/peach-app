import { View } from 'react-native'
import { Header, Icon, PeachScrollView, Screen, Text } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { ScanQR } from '../../components/camera/ScanQR'
import { Toggle } from '../../components/inputs'
import { URLInput } from '../../components/inputs/URLInput'
import { useShowHelp, useToggleBoolean } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { useNodeSetup } from './hooks/nodeSetup/useNodeSetup'

export const NodeSetup = () => {
  const {
    enabled,
    toggleEnabled,
    ssl,
    toggleSSL,
    isConnected,
    url,
    setURL,
    urlErrors,
    canCheckConnection,
    checkConnection,
    editConfig,
  } = useNodeSetup()
  const [showQRScanner, toggleShowQRScanner] = useToggleBoolean(false)

  return (
    <Screen style={tw`pb-5`}>
      <NodeSetupHeader />
      <PeachScrollView contentContainerStyle={tw`flex-grow`} contentStyle={tw`justify-center flex-grow gap-3`}>
        <Toggle style={tw`justify-between px-6`} textStyle={tw`text-black-2`} {...{ enabled }} onPress={toggleEnabled}>
          {i18n('wallet.settings.node.title')}
        </Toggle>
        <Toggle
          style={tw`justify-between px-6`}
          enabled={ssl}
          textStyle={tw`text-black-2`}
          disabled={!enabled || isConnected}
          onPress={toggleSSL}
        >
          {i18n('wallet.settings.node.ssl')}
        </Toggle>
        <View style={!enabled && tw`opacity-33`}>
          <URLInput
            value={url}
            disabled={!enabled || isConnected}
            label={i18n('wallet.settings.node.address')}
            placeholder={i18n('wallet.settings.node.address.placeholder')}
            onChange={setURL}
            errorMessage={urlErrors}
            icons={isConnected ? [['edit3', editConfig]] : undefined}
          />
        </View>
      </PeachScrollView>
      {isConnected ? (
        <View style={tw`flex-row items-center justify-center gap-1`}>
          <Text style={tw`uppercase button-medium`}>{i18n('wallet.settings.node.connected')}</Text>
          <Icon id="check" size={16} color={tw`text-success-main`.color} />
        </View>
      ) : (
        <Button disabled={!canCheckConnection} style={tw`self-center`} iconId="share2" onPress={checkConnection}>
          {i18n('wallet.settings.node.checkConnection')}
        </Button>
      )}
      {showQRScanner && <ScanQR onRead={({ data }) => setURL(data)} onCancel={toggleShowQRScanner} />}
    </Screen>
  )
}

function NodeSetupHeader () {
  const showHelp = useShowHelp('useYourOwnNode')
  return (
    <Header
      title={i18n('wallet.settings.node.title')}
      icons={[
        {
          ...headerIcons.help,
          accessibilityHint: `${i18n('help')} ${i18n('wallet.settings.node.title')}`,
          onPress: showHelp,
        },
      ]}
    />
  )
}
