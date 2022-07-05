import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button, Icon } from '..'
import { OverlayContext } from '../../contexts/overlay'
import CurrencySelect from '../../overlays/CurrencySelect'
import PaymentMethodSelect from '../../overlays/PaymentMethodSelect'
import SetPaymentDetails from '../../overlays/SetPaymentDetails'
import { session } from '../../utils/session'
import tw from '../../styles/tailwind'
import RestorePaymentData from '../../overlays/RestorePaymentData'
import { dataToMeansOfPayment } from '../../utils/paymentMethod'

type AddPaymentMethod = ComponentProps & {
  onUpdate: () => void,
  view: 'buyer' | 'seller'
}

export default ({ style, onUpdate, view }: AddPaymentMethod): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onRestore = () => {
    const meansOfPayment = session.unsavedPaymentData!.reduce(dataToMeansOfPayment, {} as MeansOfPayment)

    updateOverlay({
      content: <SetPaymentDetails
        meansOfPayment={meansOfPayment}
        restoredPaymentData={session.unsavedPaymentData}
        onConfirm={() => {}}
      />,
      showCloseIcon: true,
      showCloseButton: false
    })
  }
  const onPaymentMethodSelect = (meansOfPayment: MeansOfPayment) => updateOverlay({
    content: <SetPaymentDetails meansOfPayment={meansOfPayment} onConfirm={onUpdate} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const onCurrencySelect = (currencies: Currency[]) => updateOverlay({
    content: <PaymentMethodSelect currencies={currencies} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const openCurrencySelect = () => updateOverlay({
    content: <CurrencySelect onConfirm={onCurrencySelect} view={view} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const addPaymentMethods = () => {
    if (session.unsavedPaymentData) {
      updateOverlay({
        content: <RestorePaymentData
          paymentData={session.unsavedPaymentData}
          onConfirm={onRestore}
          onCancel={openCurrencySelect}
        />,
        showCloseIcon: true,
        showCloseButton: false
      })
    } else {
      openCurrencySelect()
    }
  }

  return <View style={style}>
    <View style={tw`flex items-center`}>
      <Button
        title={<Icon id="plus" style={tw`w-5 h-5`} color={tw`text-white-1`.color as string} />}
        wide={false}
        onPress={addPaymentMethods}
      />
    </View>
  </View>
}