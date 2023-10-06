import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { PriceFormat, Text } from '..'
import { useBitcoinStore } from '../../store/bitcoinStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { round } from '../../utils/math'
import { thousands } from '../../utils/string'

const colStyle = [tw`flex-row items-center gap-2`, tw.md`flex-col items-start gap-0`]
const unitStyle = tw`subtitle-1`

type Props = {
  type?: 'buy' | 'sell'
}

export const Tickers = ({ type = 'sell' }: Props) => {
  const [currency, satsPerUnit, price] = useBitcoinStore(
    (state) => [state.currency, state.satsPerUnit, state.price],
    shallow,
  )
  const valueStyle = [tw`leading-xl`, type === 'sell' ? tw`text-primary-main` : tw`text-success-main`, tw.md`body-l`]

  return (
    <View style={[tw`flex-row items-center justify-between py-1 px-sm`, tw.md`px-md py-2px`]}>
      <View style={colStyle}>
        <Text style={unitStyle}>{`1 ${i18n('btc')}`}</Text>
        <PriceFormat style={valueStyle} currency={currency} amount={price} round />
      </View>
      <View style={[...colStyle, tw.md`items-end`]}>
        <Text style={[unitStyle, tw`text-right`]}>{`1 ${currency}`}</Text>
        <Text style={[...valueStyle, tw`text-right`]}>
          {i18n('currency.format.sats', thousands(round(satsPerUnit)))}
        </Text>
      </View>
    </View>
  )
}
