import { View } from 'react-native'
import { PeachText } from '../../../components/text/PeachText'
import { PriceFormat } from '../../../components/text/PriceFormat'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

const textStyle = tw`font-bold tooltip`

type Props = ComponentProps & {
  amount: number
  limit: number
  displayCurrency: Currency
  type: 'daily' | 'monthly' | 'yearly'
}
export const TradingLimitAmount = ({ amount, limit, displayCurrency, style, type }: Props) => (
  <View style={style}>
    <PeachText style={tw`tooltip text-black-2`}>
      {i18n(`profile.tradingLimits.${type}`)}
      {'  '}
      <PriceFormat style={[textStyle, tw`text-primary-main`]} currency={displayCurrency} amount={amount} round />
      <PeachText style={[textStyle, tw`text-black-2`]}> / </PeachText>
      <PriceFormat style={[textStyle, tw`text-primary-mild-1`]} currency={displayCurrency} amount={limit} round />
    </PeachText>
  </View>
)
