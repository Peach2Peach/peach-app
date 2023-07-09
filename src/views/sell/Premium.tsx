import { View } from 'react-native'
import { BitcoinPriceStats, HorizontalLine, PremiumSlider, Text } from '../../components'
import { BTCAmount } from '../../components/bitcoin'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { PremiumInput } from './components'

type Props = {
  premium: number
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void
  confirmButton: React.ReactNode
  amount: number
  offerPrice: React.ReactNode
}

export const Premium = ({ premium, setPremium, confirmButton, amount, offerPrice }: Props) => (
  <View style={tw`h-full`}>
    <View style={[tw`px-4`, tw.md`px-8`]}>
      <HorizontalLine style={tw`mb-2`} />
      <BitcoinPriceStats />
    </View>
    <View style={[tw`flex-grow px-4`, tw.md`px-8`]}>
      <View style={tw`items-center justify-center flex-grow`}>
        <View style={tw`items-center self-stretch gap-7`}>
          <View style={tw`items-center`}>
            <Text style={[tw`text-center h6`, tw.md`h5`]}>{i18n('sell.premium.title')}</Text>
            <View style={tw`flex-row items-center gap-1`}>
              <Text style={tw`text-center subtitle-1`}>{i18n('search.sellOffer')}</Text>
              <BTCAmount size="small" amount={amount} />
            </View>
          </View>
          <View style={tw`items-center gap-1`}>
            <PremiumInput premium={premium} setPremium={setPremium} />
            {offerPrice}
          </View>
          <PremiumSlider style={tw`items-center self-stretch gap-6px`} premium={premium} setPremium={setPremium} />
        </View>
      </View>
      {confirmButton}
    </View>
  </View>
)
