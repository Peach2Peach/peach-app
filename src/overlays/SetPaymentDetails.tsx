import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../styles/tailwind'

import { Fade, Headline } from '../components'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import PaymentMethodSelect from './PaymentMethodSelect'
import { getPaymentMethods } from '../utils/paymentMethod'
import { PaymentMethodForms } from '../components/inputs/paymentMethods/paymentForms'
import keyboard from '../effects/keyboard'

type SetPaymentDetailsProps = {
  meansOfPayment: MeansOfPayment,
  onConfirm: (meansOfPayment: MeansOfPayment) => void
}

export const SetPaymentDetails = ({ meansOfPayment, onConfirm }: SetPaymentDetailsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const paymentMethods = getPaymentMethods(meansOfPayment)
  const [page, setPage] = useState(0)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const activePaymentMethod = paymentMethods[page]

  const PaymentMethodForm = activePaymentMethod ? PaymentMethodForms[activePaymentMethod] : null

  const confirm = () => {
    if (page < paymentMethods.length) {
      setPage(p => p + 1)
    } else {
      onConfirm(meansOfPayment)
    }
  }

  const onPaymentMethodSelect = (mops: MeansOfPayment) => updateOverlay({
    content: <SetPaymentDetails meansOfPayment={mops} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const goBack = () => updateOverlay({
    content: <PaymentMethodSelect
      currencies={Object.keys(meansOfPayment) as Currency[]}
      meansOfPayment={meansOfPayment}
      onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  useEffect(keyboard(setKeyboardOpen), [])

  return <View style={tw`w-full h-full pt-14 flex items-center justify-between`}>
    <View style={tw`w-full`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('paymentMethod.details.title') + '\n'}
        {i18n(`paymentMethod.${activePaymentMethod}`)}
      </Headline>
    </View>
    <View style={tw`h-full flex justify-center flex-shrink`}>
      {PaymentMethodForm
        ? <PaymentMethodForm style={tw`h-full flex-shrink flex-col justify-between`}
          view="new"
          onSubmit={confirm}
          onCancel={goBack}
        />
        : null
      }
    </View>
    <View style={tw`w-full h-8 flex items-center justify-end`}>
      <Fade show={!keyboardOpen} style={tw`flex-row`}>
        {paymentMethods.map((paymentMethod, i) => <Pressable
          key={paymentMethod}
          style={[
            tw`w-4 h-4 bg-white-1 rounded-full`,
            page === i ? {} : tw`opacity-30`,
            i > 0 ? tw`ml-3` : {}
          ]}
          onPress={() => setPage(i)} />)}
      </Fade>
    </View>
  </View>
}

export default SetPaymentDetails