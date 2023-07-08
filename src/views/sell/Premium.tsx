import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { BitcoinPriceStats, HorizontalLine, PremiumSlider, PrimaryButton, Text } from '../../components'
import { BTCAmount } from '../../components/bitcoin'
import { useNavigation } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { CurrentOfferPrice, PremiumInput } from './components'
import { usePremiumSetup } from './hooks/usePremiumSetup'

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

export const OfferPreferencePremium = () => {
  const navigation = useNavigation()
  usePremiumSetup()
  const isStepValid = useOfferPreferences((state) => state.canContinue.premium)
  const amount = useOfferPreferences((state) => state.sellAmount)
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium], shallow)
  const next = () => navigation.navigate('sellPreferences')

  return (
    <Premium
      premium={premium}
      setPremium={setPremium}
      amount={amount}
      confirmButton={
        <PrimaryButton style={tw`self-center mb-5`} disabled={!isStepValid} narrow onPress={next}>
          {i18n('next')}
        </PrimaryButton>
      }
      offerPrice={<CurrentOfferPrice />}
    />
  )
}
