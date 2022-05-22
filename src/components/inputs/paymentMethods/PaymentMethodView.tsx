import React, { useContext } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

import { OverlayContext } from '../../../contexts/overlay'
import { PaymentMethodForms } from './paymentForms'
import { Headline } from '../../text'
import { PaymentMethodViewProps } from '.'

export const PaymentMethodView = ({ data, onSubmit }: PaymentMethodViewProps) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const PaymentForm = PaymentMethodForms[data.type]

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  return <View style={tw`h-full w-full flex-shrink flex-col`}>
    <Headline style={tw`text-white-1 text-3xl leading-5xl`}>
      {i18n('paymentMethod.view')}
    </Headline>
    {PaymentForm
      ? <PaymentForm style={tw`h-full flex-shrink flex-col justify-between`}
        data={data} view="edit" onSubmit={onSubmit} onCancel={closeOverlay} />
      : null
    }
  </View>
}