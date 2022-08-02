import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import i18n from '../../utils/i18n'

type CurrencySelectProps = {
  currency?: Currency,
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
  setStepValid: React.Dispatch<React.SetStateAction<boolean>>,
}

export default ({ currency = 'EUR', setCurrency, setStepValid }: CurrencySelectProps): ReactElement => {
  const currencies = CURRENCIES.map(c => ({
    value: c,
    display: i18n(`currency.${c}`)
  }))

  useEffect(() => {
    setStepValid(true)
  }, [])

  return <View style={tw`flex h-full`}>
    <Headline>
      {i18n('currency.select.title')}
    </Headline>
    <View style={tw`h-full flex-shrink flex justify-center px-10`}>
      <RadioButtons items={currencies}
        selectedValue={currency}
        onChange={c => setCurrency(c as Currency)}
      />
    </View>
  </View>
}