import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { Button, Headline, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type RestorePaymentDataProps = {
  paymentData: PaymentData[]
  onConfirm: (paymentData: PaymentData[]) => void
  onCancel: () => void
}

export default ({ onConfirm, onCancel }: RestorePaymentDataProps): ReactElement => (
  <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 text-xl leading-8`}>{i18n('paymentMethod.restore.title')}</Headline>
    <Text style={tw`text-center text-white-1`}>{i18n('paymentMethod.restore.description')}</Text>

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
)
