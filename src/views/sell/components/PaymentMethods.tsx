import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button, Icon } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import CurrencySelect, { CurrencySelection } from '../../../overlays/CurrencySelect'
import PaymentMethodSelect from '../../../overlays/PaymentMethodSelect'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onPaymentMethodSelect = (meansOfPayment: MeansOfPayment) => console.log(meansOfPayment)
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