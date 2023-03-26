import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import shallow from 'zustand/shallow'
import { PriceFormat, Text } from '../.'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { round } from '../../utils/math'
import { thousands } from '../../utils/string'

export const BitcoinPriceStats = () => {
  const [currency, satsPerUnit, price] = useBitcoinStore(
    (state) => [state.currency, state.satsPerUnit, state.price],
    shallow,
  )

  return (
    <View style={tw`flex-row justify-between`}>
      <View>
        <Text style={tw`subtitle-1`}>1 {i18n('btc')}</Text>
        <PriceFormat style={tw`body-l text-primary-main`} currency={currency} amount={price} round />
      </View>
      <View>
        <Text style={tw`text-right subtitle-1`}>{currency === 'CHF' ? `${currency} 1` : `1 ${currency}`}</Text>
        <Text style={tw`text-right body-l text-primary-main`}>
          {i18n('currency.format.sats', thousands(round(satsPerUnit)))}
        </Text>
      </View>
    </View>
  )
}
