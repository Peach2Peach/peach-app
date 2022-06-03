import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button, Icon } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import CurrencySelect from '../../../overlays/CurrencySelect'
import PaymentMethodSelect from '../../../overlays/PaymentMethodSelect'
import SetPaymentDetails from '../../../overlays/SetPaymentDetails'
import tw from '../../../styles/tailwind'

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onPaymentMethodSelect = (meansOfPayment: MeansOfPayment) => updateOverlay({
    content: <SetPaymentDetails meansOfPayment={meansOfPayment} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })
  const onCurrencySelect = (currencies: Currency[]) => updateOverlay({
    content: <PaymentMethodSelect currencies={currencies} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const addPaymentMethods = () => updateOverlay({
    content: <CurrencySelect onConfirm={onCurrencySelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

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