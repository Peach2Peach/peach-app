import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'
import { OverlayContext } from '../../../../contexts/overlay'
import Currency from '../../../../overlays/info/Currency'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getPaymentMethodInfo } from '../../../../utils/paymentMethod'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import { Item } from '../../Item'

export const toggleCurrency = (currency: Currency) => (currencies: Currency[]) => {
  if (currencies.indexOf(currency) === -1) {
    currencies.push(currency)
  } else {
    currencies = currencies.filter(c => c !== currency)
  }
  return [...currencies]
}

type CurrencySelectionProps = ComponentProps & {
  paymentMethod: PaymentMethod
  selectedCurrencies: Currency[]
  onToggle: (currencies: Currency) => void
}

export const CurrencySelection = ({
  paymentMethod,
  selectedCurrencies,
  onToggle,
  style,
}: CurrencySelectionProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [paymentMethodInfo] = useState(getPaymentMethodInfo(paymentMethod))

  const openCurrencyHelp = () =>
    updateOverlay({
      content: <Currency />,
      help: true,
      showCloseIcon: true,
    })

  return (
    <View style={style}>
      <View style={tw`items-center flex-row`}>
        <Text style={tw`font-baloo text-lg`}>
          {i18n('form.additionalCurrencies')} ({i18n('form.optional')})
        </Text>
        <Pressable style={tw`p-3`} onPress={openCurrencyHelp}>
          <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
        </Pressable>
      </View>
      <View style={tw`flex-row mt-1`}>
        {paymentMethodInfo.currencies.map((currency, i) => (
          <Item
            key={currency}
            style={[tw`h-6 px-2`, i > 0 ? tw`ml-2` : {}]}
            label={currency}
            isSelected={selectedCurrencies.indexOf(currency) !== -1}
            onPress={() =>
              selectedCurrencies.indexOf(currency) === -1 || selectedCurrencies.length > 1 ? onToggle(currency) : null
            }
          />
        ))}
      </View>
    </View>
  )
}
