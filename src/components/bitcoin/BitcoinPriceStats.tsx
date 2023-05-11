import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { PriceFormat, Text } from '../.'
import { useBitcoinStore } from '../../store/bitcoinStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { round } from '../../utils/math'
import { thousands } from '../../utils/string'

export const BitcoinPriceStats = () => {
  const [currency, satsPerUnit, price] = useBitcoinStore(
    (state) => [state.currency, state.satsPerUnit, state.price],
    shallow,
  )
  const colStyle = tw`flex-row items-center gap-2 md:flex-col md:items-start md:gap-0`
  const unitStyle = tw`subtitle-1`
  const valueStyle = tw`body-m text-primary-main leading-xl md:body-l`

  return (
    <View style={tw`flex-row justify-between`}>
      <View style={colStyle}>
        <Text style={unitStyle}>1 {i18n('btc')}</Text>
        <PriceFormat style={valueStyle} currency={currency} amount={price} round />
      </View>
      <View style={[colStyle, tw`md:items-end`]}>
        <Text style={[unitStyle, tw`text-right`]}>{currency === 'CHF' ? `${currency} 1` : `1 ${currency}`}</Text>
        <Text style={[valueStyle, tw`text-right`]}>{i18n('currency.format.sats', thousands(round(satsPerUnit)))}</Text>
      </View>
    </View>
  )
}
