import { View } from 'react-native'
import { Icon, PeachScrollView, PrimaryButton, Screen, Text } from '../../components'
import { Input, Toggle } from '../../components/inputs'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { NodeSetupHeader } from './headers/NodeSetupHeader'
import { useNodeSetup } from './hooks/useNodeSetup'

export const NodeSetup = () => {
  const {
    enabled,
    toggleEnabled,
    ssl,
    toggleSSL,
    isConnected,
    address,
    setAddress,
    addressErrors,
    pasteAddress,
    openQRScanner,
    checkConnection,
  } = useNodeSetup()

  return (
    <Screen style={tw`pb-5`}>
      <NodeSetupHeader />
      <PeachScrollView contentContainerStyle={tw`flex-grow`} contentStyle={tw`justify-center flex-grow gap-3`}>
        <Toggle style={tw`justify-between px-6`} {...{ enabled }} onPress={toggleEnabled}>
          {i18n('wallet.settings.node.title')}
        </Toggle>
        <Toggle style={tw`justify-between px-6`} enabled={ssl} disabled={!enabled} onPress={toggleSSL}>
          {i18n('wallet.settings.node.ssl')}
        </Toggle>
        <View style={!enabled && tw`opacity-33`}>
          <Input
            value={address}
            disabled={!enabled}
            label={i18n('wallet.settings.node.address')}
            placeholder={i18n('wallet.settings.node.address.placeholder')}
            onChange={setAddress}
            errorMessage={addressErrors}
            icons={[
              ['clipboard', pasteAddress],
              ['camera', openQRScanner],
            ]}
          />
        </View>
      </PeachScrollView>
      {isConnected ? (
        <View style={tw`flex-row justify-center items-center gap-1`}>
          <Text style={tw`uppercase button-medium`}>{i18n('wallet.settings.node.connected')}</Text>
          <Icon id="maximize" style={tw`w-4 h-4`} color={tw`text-black-3`.color} />
        </View>
      ) : (
        <PrimaryButton disabled={!enabled} style={tw`self-center`} iconId="share2" onPress={checkConnection}>
          {i18n('wallet.settings.node.checkConnection')}
        </PrimaryButton>
      )}
    </Screen>
  )
}
