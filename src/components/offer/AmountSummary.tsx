import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SatsFormat } from '../text'
import { Divider } from '../Divider'

type Props = {
  amount: number
}
export const AmountSummary = ({ amount }: Props) => (
  <View>
    <Divider text={i18n('amount')} />
    <SatsFormat
      sats={amount}
      style={[tw`font-semibold subtitle-1 text-xl`, tw.md`text-2xl`]}
      satsStyle={[tw`font-normal text-base`, tw.md`text-lg`]}
      bitcoinLogoStyle={[tw`w-4 h-4 mr-1 -mt-1`, tw.md`w-5 h-5`]}
    />
  </View>
)
