import { ReactElement } from 'react';
import { View } from 'react-native'
import { HorizontalLine, PaymentLogo, Text } from '../components'
import { PaymentLogoType } from '../components/payment/logos'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { sortAlphabetically } from '../utils/array/sortAlphabetically'

type PaymentMethodSelectProps = {
  paymentMethods: PaymentMethod[]
  onSelect: (method: PaymentMethod) => void
}
export const PaymentMethodSelect = ({ paymentMethods, onSelect }: PaymentMethodSelectProps): ReactElement => (
  <View>
    {paymentMethods
      .sort((a, b) => sortAlphabetically(i18n(`paymentMethod.${a}`), i18n(`paymentMethod.${b}`)))
      .map((method) => (
        <View key={method}>
          <View style={tw`flex flex-row items-center px-8`}>
            <View
              style={[tw`mr-4 px-1`, !method.includes('nationalTransfer') && tw`py-1 border rounded-lg border-black-6`]}
            >
              <PaymentLogo id={method as PaymentLogoType} style={tw`w-6 h-6`} />
            </View>
            <Text style={tw`flex-shrink w-full subtitle-1`} onPress={() => onSelect(method)}>
              {i18n(`paymentMethod.${method}`)}
            </Text>
          </View>
          <HorizontalLine style={tw`my-6`} />
        </View>
      ))}
  </View>
)
