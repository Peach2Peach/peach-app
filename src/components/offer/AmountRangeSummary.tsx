import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SatsFormat, Text } from '../text'
import { TradeSeparator } from './TradeSeparator'

type Props = {
  amount: number[]
}
export const AmountRangeSummary = ({ amount }: Props) => (
  <View>
    <TradeSeparator text={i18n('amount')} />
    <SatsFormat
      sats={amount[0]}
      style={[tw`font-semibold subtitle-1 text-lg`, tw.md`text-xl`]}
      satsStyle={[tw`font-normal text-3xs`, tw.md`text-base`]}
      bitcoinLogoStyle={[tw`w-3 h-3 mr-1 -mt-1`, tw.md`w-4 h-4`]}
    />
    <Text style={tw`button-small text-black-2 -mt-2 -mb-1`}>{i18n('upTo')}</Text>
    <SatsFormat
      sats={amount[1]}
      style={[tw`font-semibold subtitle-1 text-lg`, tw.md`text-xl`]}
      satsStyle={[tw`font-normal text-3xs`, tw.md`text-base`]}
      bitcoinLogoStyle={[tw`w-3 h-3 mr-1  -mt-1`, tw.md`w-4 h-4`]}
    />
  </View>
)
