import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SatsFormat, Text } from '../text'
import { TradeSeparator } from './TradeSeparator'

type Props = {
  amount: number[]
}
export const AmountRangeSummary = ({ amount }: Props) => (
  <View style={tw`gap-2px`}>
    <TradeSeparator text={i18n('amount')} />
    <View>
      <SatsFormat
        sats={amount[0]}
        style={[tw`text-lg font-semibold subtitle-1`, tw.md`text-xl`]}
        satsStyle={[tw`font-normal text-3xs`, tw.md`text-base`]}
        bitcoinLogoStyle={[tw`w-3 h-3 mr-1 -mt-1`, tw.md`w-4 h-4`]}
      />
      <Text style={tw`-mt-2 -mb-1 button-small text-black-2`}>{i18n('upTo')}</Text>
      <SatsFormat
        sats={amount[1]}
        style={[tw`text-lg font-semibold subtitle-1`, tw.md`text-xl`]}
        satsStyle={[tw`font-normal text-3xs`, tw.md`text-base`]}
        bitcoinLogoStyle={[tw`w-3 h-3 mr-1 -mt-1`, tw.md`w-4 h-4`]}
      />
    </View>
  </View>
)
