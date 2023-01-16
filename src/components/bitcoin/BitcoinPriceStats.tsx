import React from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import shallow from 'zustand/shallow'
import { Text } from '../.'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { priceFormat, thousands } from '../../utils/string'

export const BitcoinPriceStats = () => {
  const [currency, satsPerUnit, price] = useBitcoinStore(
    (state) => [state.currency, state.satsPerUnit, state.price],
    shallow,
  )

  return (
    <View style={tw`flex-row justify-between`}>
      <View>
        <Text style={tw`subtitle-1`}>1 Bitcoin</Text>
        <Text style={tw`body-l text-black-2`}>
          {i18n(`currency.format.${currency}`, priceFormat(Math.round(price)))}
        </Text>
      </View>
      <View>
        <Text style={tw`text-right subtitle-1`}>1 {i18n(`currency.${currency}`)}</Text>
        <Text style={tw`text-right body-l text-black-2`}>
          {i18n('currency.format.sats', thousands(Math.round(satsPerUnit)))}
        </Text>
      </View>
    </View>
  )
}
