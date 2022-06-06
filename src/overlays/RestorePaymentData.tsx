import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'

import { Button, Headline, Loading, Text } from '../components'
import Icon from '../components/Icon'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { cancelOffer } from '../utils/peachAPI'
import { error, info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import Refund from './Refund'


type RestorePaymentDataProps = {
  paymentData: PaymentData[],
  onConfirm: (paymentData: PaymentData[]) => void
  onCancel: () => void
}

export default ({ paymentData, onConfirm, onCancel }: RestorePaymentDataProps): ReactElement =>
  <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 text-xl leading-8`}>
      {i18n('paymentMethod.restore.title')}
    </Headline>
    <Text style={tw`text-center text-white-1`}>
      {i18n('paymentMethod.restore.description')}
    </Text>

    <View>
      <Button
        style={tw`mt-2`}
        title={i18n('paymentMethod.restore.restore')}
        secondary={true}
        wide={false}
        onPress={onConfirm}
      />
      <Button
        style={tw`mt-2`}
        title={i18n('paymentMethod.restore.cancel')}
        tertiary={true}
        wide={false}
        onPress={onCancel}
      />
    </View>
  </View>