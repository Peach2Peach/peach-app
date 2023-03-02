import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { CopyAble, Input, PrimaryButton } from '../../components'
import { Text } from '../../components/text'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSignMessageSetup } from './hooks/useSignMessageSetup'

export default (): ReactElement => {
  const { address, message, submit, signature, setSignature, signatureValid, signatureError } = useSignMessageSetup()

  const submitSignature = () => submit(signature)

  const pasteSignature = async () => {
    const clipboard = await Clipboard.getString()
    setSignature(clipboard)
  }

  const keyboardOpen = useKeyboard()

  return (
    <>
      <KeyboardAvoidingView style={tw`justify-center flex-1 px-8 mt-3 `} behavior="padding">
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
          {...{
            onChange: setSignature,
            value: signature,
            label: i18n('buy.addressSigning.signature'),
            placeholder: i18n('buy.addressSigning.signature'),
            autoCorrect: false,
            errorMessage: signatureError,
            icons: [['clipboard', pasteSignature]],
          }}
        />
      </KeyboardAvoidingView>
      {!keyboardOpen && (
        <PrimaryButton style={tw`self-center mb-4 w-52`} disabled={!signatureValid} onPress={submitSignature} narrow>
          {i18n('confirm')}
        </PrimaryButton>
      )}
    </>
  )
}
