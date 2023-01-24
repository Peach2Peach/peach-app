import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Input, Loading, PeachScrollView, PrimaryButton } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { isBuyOffer } from '../../utils/offer'
import { useSignMessageSetup } from './hooks/useSignMessageSetup'

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
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`px-8`}>
      <View>
        <Input
          inputStyle={tw`bg-primary-background-light`}
          {...{
            value: offer.releaseAddress,
            label: i18n('buy.addressSigning.yourAddress'),
            disabled: true,
            icons: [['copy', copyAddress]],
          }}
        />
        <Input
          inputStyle={tw`h-40 bg-primary-background-light`}
          {...{
            value: message,
            multiline: true,
            disabled: true,
            label: i18n('buy.addressSigning.message'),
            icons: [['copy', copyMessage]],
          }}
        />
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
      <View style={tw`flex items-center mt-16`}>
        <PrimaryButton style={tw`w-52`} disabled={!signatureValid} onPress={submitSignature} narrow>
          {i18n('confirm')}
        </PrimaryButton>
      </View>
    </PeachScrollView>
  )
}
