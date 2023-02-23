import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Input, PeachScrollView, PrimaryButton } from '../../components'
import { Text } from '../../components/text'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useSignMessageSetup } from './hooks/useSignMessageSetup'

export default (): ReactElement => {
  const { address, message, submit, signature, setSignature, signatureValid, signatureError } = useSignMessageSetup()
  const [addressCopied, setAddressCopied] = useState(false)
  const [messageCopied, setMessageCopied] = useState(false)

  const submitSignature = () => submit(signature)

  const copyAddress = () => {
    if (!address) return
    Clipboard.setString(address)
    setAddressCopied(true)
  }
  const copyMessage = () => {
    if (!message) return
    Clipboard.setString(message)
    setMessageCopied(true)
  }
  const pasteSignature = async () => {
    const clipboard = await Clipboard.getString()
    setSignature(clipboard)
  }

  const keyboardOpen = useKeyboard()

  return (
    <>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-grow px-8`}>
        <View style={tw`flex-1 mt-3`}>
          <Text style={[tw`pl-2 input-label`]}>{i18n('buy.addressSigning.yourAddress')}</Text>
          <View
            style={[
              tw`flex-row items-center justify-between px-3 py-2 mb-5`,
              tw`border rounded-xl`,
              tw`bg-primary-background-light`,
            ]}
          >
            <Text style={tw`flex-1 input-text`}>{address}</Text>
            <Pressable onPress={copyAddress} style={tw`items-center justify-center pl-1`}>
              <Icon id={'copy'} style={tw`w-5 h-5`} color={tw`text-black-1`.color} />
              {addressCopied && <Text style={tw`subtitle-2`}>{i18n('copied')}</Text>}
            </Pressable>
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
            <Pressable onPress={copyMessage} style={tw`items-center justify-center pl-1`}>
              <Icon id={'copy'} style={tw`w-5 h-5`} color={tw`text-black-1`.color} />
              {messageCopied && <Text style={tw`subtitle-2`}>{i18n('copied')}</Text>}
            </Pressable>
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
        </View>
      </PeachScrollView>
      {!keyboardOpen && (
        <PrimaryButton style={tw`self-center mb-4 w-52`} disabled={!signatureValid} onPress={submitSignature} narrow>
          {i18n('confirm')}
        </PrimaryButton>
      )}
    </>
  )
}
