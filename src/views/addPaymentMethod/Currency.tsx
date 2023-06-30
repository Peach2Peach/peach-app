import { useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'

type Props = {
  currency?: Currency
  setCurrency: (c: Currency) => void
  back: () => void
  next: () => void
}

export const Currency = ({ currency = 'EUR', setCurrency, next }: Props) => {
  useHeaderSetup(useMemo(() => ({ title: i18n('paymentMethod.select') }), []))
  const currencies = CURRENCIES.map((c) => ({
    value: c,
    display: i18n(`currency.${c}`),
  }))
  return (
    <View style={tw`h-full`}>
      <PeachScrollView contentStyle={[tw`h-full p-4`, tw.md`p-8`]} contentContainerStyle={tw`flex-grow`}>
        <RadioButtons
          style={tw`items-center justify-center`}
          items={currencies}
          selectedValue={currency}
          onChange={setCurrency}
        />
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mt-2 mb-5`} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
