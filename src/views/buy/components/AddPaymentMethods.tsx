import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button, Icon } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import CurrencySelect from '../../../overlays/CurrencySelect'
import PaymentMethodSelect from '../../../overlays/PaymentMethodSelect'
import SetPaymentDetails from '../../../overlays/SetPaymentDetails'
import { session } from '../../../utils/session'
import tw from '../../../styles/tailwind'
import RestorePaymentData from '../../../overlays/RestorePaymentData'
import { dataToMeansOfPayment, getCurrencies, getPaymentMethods } from '../../../utils/paymentMethod'
import i18n from '../../../utils/i18n'
import { account, addPaymentData, getPaymentDataByType, saveAccount } from '../../../utils/account'


const initPaymentData = (meansOfPayment: MeansOfPayment) => {
  const paymentMethods = getPaymentMethods(meansOfPayment)
  const currencies = getCurrencies(meansOfPayment)

  return paymentMethods.map(type => {
    const existingPaymentMethodsOfType = getPaymentDataByType(type).length + 1
    const label = i18n(`paymentMethod.${type}`) + ' #' + existingPaymentMethodsOfType
    const selectedCurrencies = currencies.filter(currency => meansOfPayment[currency]?.indexOf(type) !== -1)

    return {
      id: `${type}-${new Date().getTime()}`,
      label,
      type,
      currencies: selectedCurrencies
    }
  })
}

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onPaymentMethodSelect = async (meansOfPayment: MeansOfPayment) => {
    const paymentData = initPaymentData(meansOfPayment)
    for (const newData of paymentData) {
      await addPaymentData(newData as PaymentData, false) // eslint-disable-line no-await-in-loop
    }
    await saveAccount(account, session.password!)
  }
  const onCurrencySelect = (currencies: Currency[]) => updateOverlay({
    content: <PaymentMethodSelect currencies={currencies} onConfirm={onPaymentMethodSelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const openCurrencySelect = () => updateOverlay({
    content: <CurrencySelect onConfirm={onCurrencySelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  const addPaymentMethods = () => {
    openCurrencySelect()
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