import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'

type Props = {
  countries:
    | {
        value: PaymentMethodCountry
        display: string
      }[]
    | undefined
  selectedCountry?: PaymentMethodCountry
  setCountry: (country?: PaymentMethodCountry) => void
  next: () => void
}

export const Countries = ({ countries, selectedCountry, setCountry, next }: Props) => {
  useHeaderSetup({ title: i18n('paymentMethod.giftCard.countrySelect.title') })

  return (
    <View style={tw`h-full`}>
      <PeachScrollView contentStyle={[tw`h-full p-4`, tw.md`p-8`]} contentContainerStyle={tw`flex-grow`}>
        {!!countries && (
          <RadioButtons
            style={tw`items-center justify-center flex-grow`}
            items={countries}
            selectedValue={selectedCountry}
            onChange={setCountry}
          />
        )}
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mt-2 mb-5`} disabled={!selectedCountry} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
