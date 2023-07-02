import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PrimaryButton } from '../../components'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'
import { CurrencyTabs } from './CurrencyTabs'

type Props = {
  currency?: Currency
  setCurrency: (c: Currency) => void
  next: () => void
}

export const Currency = ({ currency = 'EUR', setCurrency, next }: Props) => {
  useHeaderSetup({ title: i18n('paymentMethod.select') })

  return (
    <View style={tw`h-full`}>
      <CurrencyTabs {...{ currency, setCurrency }} />
      <PrimaryButton style={tw`self-center mt-2 mb-5`} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
