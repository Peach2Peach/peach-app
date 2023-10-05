import Clipboard from '@react-native-clipboard/clipboard'
import { View } from 'react-native'
import { CopyAble, Header, Input, PeachScrollView, Screen } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { Text } from '../../components/text'
import { useKeyboard, useShowHelp } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { useSignMessageSetup } from './hooks/useSignMessageSetup'

export const SignMessage = () => {
  const { address, message, submit, signature, setSignature, signatureValid, signatureError } = useSignMessageSetup()

  const submitSignature = () => submit(signature)

  const pasteSignature = async () => {
    const clipboard = await Clipboard.getString()
    if (clipboard) setSignature(clipboard)
  }

  const keyboardOpen = useKeyboard()

  return (
    <Screen header={<SignMessageHeader />}>
      <PeachScrollView style={tw`grow`} contentContainerStyle={tw`justify-center grow`}>
        <Text style={[tw`pl-2 input-label`]}>{i18n('buy.addressSigning.yourAddress')}</Text>
        <View
          style={[
            tw`flex-row items-center justify-between px-3 py-2 mb-5`,
            tw`border rounded-xl`,
            tw`bg-primary-background-light`,
          ]}
        >
          <Text style={tw`flex-1 input-text`}>{address}</Text>
          <CopyAble value={address || ''} style={tw`w-5 h-5 ml-2`} color={tw`text-black-1`} />
        </View>
        <Text style={[tw`pl-2 input-label`]}>{i18n('buy.addressSigning.message')}</Text>
        <View
          style={[
            tw`flex-row items-center justify-between px-3 py-2 mb-5`,
            tw`border rounded-xl`,
            tw`bg-primary-background-light`,
          ]}
        >
          <Text style={tw`flex-1 input-text`}>{message}</Text>
          <CopyAble value={message || ''} style={tw`w-5 h-5 ml-2`} color={tw`text-black-1`} />
        </View>
        <Input
          value={signature}
          onChange={setSignature}
          label={i18n('buy.addressSigning.signature')}
          placeholder={i18n('buy.addressSigning.signature')}
          autoCorrect={false}
          errorMessage={signatureError}
          icons={[['clipboard', pasteSignature]]}
        />
      </PeachScrollView>
      {!keyboardOpen && (
        <Button style={tw`self-center min-w-52`} disabled={!signatureValid} onPress={submitSignature}>
          {i18n('confirm')}
        </Button>
      )}
    </Screen>
  )
}

function SignMessageHeader () {
  const showHelp = useShowHelp('addressSigning')
  return <Header title={i18n('buy.addressSigning.title')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}
