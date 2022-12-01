import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, PrimaryButton, Text } from '../../components'
import i18n from '../../utils/i18n'
import { OverlayContext } from '../../contexts/overlay'

type PaymentMethodEditProps = {
  paymentData: PaymentData
  onConfirm: (data: PaymentData) => void
}

export default ({ paymentData, onConfirm }: PaymentMethodEditProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const confirm = () => {
    closeOverlay()
    onConfirm(paymentData)
  }

  return (
    <View>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('help.paymentMethodEdit.title')}</Headline>
      <View style={tw`flex justify-center items-center mt-6`}>
        <Text style={tw`text-white-1 text-center`}>{i18n('help.paymentMethodEdit.description.1')}</Text>
        <Text style={tw`text-white-1 text-center mt-2`}>{i18n('help.paymentMethodEdit.description.2')}</Text>
      </View>
      <View style={tw`flex-col items-center mt-8`}>
        {/** what is this crazy style?? */}
        <PrimaryButton style={tw``} onPress={closeOverlay}>
          {i18n('neverMind')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} onPress={confirm}>
          {i18n('continue')}
        </PrimaryButton>
      </View>
    </View>
  )
}
