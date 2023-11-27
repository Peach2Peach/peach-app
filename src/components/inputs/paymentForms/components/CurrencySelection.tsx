import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getPaymentMethodInfo } from '../../../../utils/paymentMethod'
import { Text } from '../../../text'
import { CurrencyItem } from '../../CurrencyItem'

type Props = ComponentProps & {
  paymentMethod: PaymentMethod
  selectedCurrencies: Currency[]
  onToggle: (currencies: Currency) => void
}

export const CurrencySelection = ({ paymentMethod, selectedCurrencies, onToggle, style }: Props) => (
  <View style={style}>
    <View style={tw`flex-row items-center`}>
      <Text style={tw`input-label`}>{i18n('form.additionalCurrencies')}</Text>
    </View>
    <View style={tw`flex-row flex-wrap gap-2 mt-1`}>
      {getPaymentMethodInfo(paymentMethod)?.currencies.map((currency) => (
        <CurrencyItem
          key={currency}
          label={currency}
          isSelected={selectedCurrencies.includes(currency)}
          onPress={() =>
            !selectedCurrencies.includes(currency) || selectedCurrencies.length > 1 ? onToggle(currency) : null
          }
        />
      ))}
    </View>
  </View>
)
