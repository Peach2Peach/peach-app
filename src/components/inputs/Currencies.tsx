import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Checkboxes, Headline, Text } from '..'
import { CURRENCIES } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type CurrenciesProps = {
  title: string,
  currencies: Currency[],
  setCurrencies: (currencies: Currency[]) => void
}

export default ({ title, currencies, setCurrencies }: CurrenciesProps): ReactElement => {
  const checkboxItems = CURRENCIES.map(value => ({
    value,
    display: <Text style={tw`-mt-0.5`}>
      {i18n(`currency.${value}`)} <Text style={tw`text-grey-1`}>({value})</Text>
    </Text>
  }))
  const onChange = (values: (string | number)[]) => values.length ? setCurrencies(values as Currency[]) : null

  return <View>
    <Headline style={tw`mt-16 text-grey-1`}>
      {title}
    </Headline>
    <Checkboxes
      style={tw`px-7 mt-2`}
      items={checkboxItems}
      selectedValues={currencies}
      onChange={onChange}/>
  </View>
}