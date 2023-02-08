import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Input, Loading, PeachScrollView, PrimaryButton } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { isBuyOffer } from '../../utils/offer'
import { useSignMessageSetup } from './hooks/useSignMessageSetup'
import { Text } from '../../components/text'

export default (): ReactElement => {
  const { offer, message, peachWalletActive, submit, signature, setSignature, signatureValid, signatureError }
    = useSignMessageSetup()
  const submitSignature = () => submit(signature)

  const copyAddress = () => {
    if (!offer || !isBuyOffer(offer)) return
    Clipboard.setString(offer.releaseAddress)
  }
  const copyMessage = () => {
    if (!message) return
    Clipboard.setString(message)
  }
  const pasteSignature = async () => {
    const clipboard = await Clipboard.getString()
    setSignature(clipboard)
  }

  return !offer || !isBuyOffer(offer) || !message || peachWalletActive ? (
    <View style={tw`items-center justify-center h-full`}>
      <Loading />
    </View>
  ) : (
    <PeachScrollView contentContainerStyle={tw`flex-grow px-8 `}>
      <View style={tw`h-full`}>
        <View style={tw`flex-1 mt-3`}>
          <Text style={[tw`input-label text-black-1`]}>{i18n('buy.addressSigning.yourAddress')}</Text>
          <View style={[tw`flex-row items-center px-3 py-2 mb-5`, tw`border rounded-xl`]}>
            <Text style={tw`w-60`}>{offer.releaseAddress}</Text>
            <Pressable onPress={copyAddress}>
              <Icon id={'copy'} style={tw`w-5 h-5 ml-4`} color={tw`text-black-1`.color} />
            </Pressable>
          </View>
          <Text style={[tw`input-label text-black-1`]}>{i18n('buy.addressSigning.message')}</Text>
          <View style={[tw`flex-row items-center px-3 py-2 mb-5`, tw`border rounded-xl`]}>
            <Text style={tw`w-60`}>{message}</Text>
            <Pressable onPress={copyMessage}>
              <Icon id={'copy'} style={tw`w-5 h-5 ml-4`} color={tw`text-black-1`.color} />
            </Pressable>
          </View>
          <Input
            {...{
              onChange: setSignature,
              value: signature,
              label: i18n('buy.addressSigning.signature'),
              autoCorrect: false,
              errorMessage: signatureError,
              icons: [['clipboard', pasteSignature]],
            }}
          />
        </View>
        <View style={tw`items-center mb-3`}>
          <PrimaryButton style={tw`w-52`} disabled={!signatureValid} onPress={submitSignature} narrow>
            {i18n('confirm')}
          </PrimaryButton>
        </View>
      </View>
    </PeachScrollView>
  )
}
