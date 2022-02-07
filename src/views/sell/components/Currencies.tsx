import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Checkboxes, Headline, Text } from '../../../components'
import { CURRENCIES } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type CurrenciesProps = {
  currencies: Currency[],
  setCurrencies: (currencies: Currency[]) => void
}

export default ({ currencies, setCurrencies }: CurrenciesProps): ReactElement => <View>
  <Headline style={tw`mt-9`}>
    {i18n('sell.currencies')}
  </Headline>
  <Checkboxes
    style={tw`px-7 mt-2`}
    items={CURRENCIES.map(value => ({
      value,
      display: <Text>
        {i18n(`currency.${value}`)} <Text style={tw`text-grey-1`}>({value})</Text>
      </Text>
    }))}
    selectedValues={currencies}
    onChange={values => setCurrencies(values as Currency[])}/>
</View>