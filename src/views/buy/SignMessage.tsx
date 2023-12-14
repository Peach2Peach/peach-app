import Clipboard from '@react-native-clipboard/clipboard'
import { useMemo } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { CopyAble, Header, Input, PeachScrollView, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
import { Text } from '../../components/text'
import { useKeyboard, useNavigation, useShowHelp, useValidatedState } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { getMessageToSignForAddress } from '../../utils/account/getMessageToSignForAddress'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { getMessages } from '../../utils/validation/getMessages'
import { isValidBitcoinSignature } from '../../utils/validation/isValidBitcoinSignature'
import { parseSignature } from './helpers/parseSignature'

const signatureRules = {
  required: true,
}
export const SignMessage = () => {
  const navigation = useNavigation()
  const [address, setPayoutAddressSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.setPayoutAddressSignature],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)
  const message = useMemo(
    () => (address ? getMessageToSignForAddress(publicKey, address) : undefined),
    [address, publicKey],
  )
  const [signature, setSignature, signatureExists, requiredErrors] = useValidatedState<string>('', signatureRules)

  const signatureValid = useMemo(() => {
    if (!signatureExists) return false
    return isValidBitcoinSignature(message || '', address || '', signature)
  }, [signatureExists, message, address, signature])

  const signatureError = useMemo(() => {
    let errs = requiredErrors
    if (!isValidBitcoinSignature(message || '', address || '', signature)) {
      errs = [...errs, getMessages().signature]
    }
    return errs
  }, [requiredErrors, message, address, signature])

  const parseAndSetSignature = (sig: string) => setSignature(parseSignature(sig))

  const submit = (sig: string) => {
    setPayoutAddressSignature(sig)
    navigation.goBack()
  }

  const submitSignature = () => submit(signature)

  const pasteSignature = async () => {
    const clipboard = await Clipboard.getString()
    if (clipboard) parseAndSetSignature(clipboard)
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
        <Button style={tw`self-center`} disabled={!signatureValid} onPress={submitSignature}>
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
