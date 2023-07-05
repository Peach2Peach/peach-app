import { View } from 'react-native'
import { BitcoinPriceStats, HorizontalLine, PremiumSlider, PrimaryButton, Text } from '../../components'
import { useNavigation } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { CurrentOfferAmount, CurrentOfferPrice, PremiumInput } from './components'
import { usePremiumSetup } from './hooks/usePremiumSetup'

export const Premium = () => {
  const navigation = useNavigation()
  usePremiumSetup()

  const isStepValid = useOfferPreferences((state) => state.canContinue.premium)
  const next = () => navigation.navigate('sellPreferences')

  return (
    <View style={tw`h-full`}>
      <View style={[tw`px-4`, tw.md`px-8`]}>
        <HorizontalLine style={tw`mb-2`} />
        <BitcoinPriceStats />
      </View>

      <View style={[tw`items-center justify-center flex-grow px-4`, tw.md`px-8`]}>
        <View style={tw`items-center self-stretch gap-7`}>
          <View style={tw`items-center`}>
            <Text style={[tw`text-center h6`, tw.md`h5`]}>{i18n('sell.premium.title')}</Text>
            <View style={tw`flex-row items-center gap-1`}>
              <Text style={tw`text-center subtitle-1`}>{i18n('search.sellOffer')}</Text>
              <CurrentOfferAmount />
            </View>
          </View>
          <View style={tw`items-center gap-1`}>
            <PremiumInput />
            <CurrentOfferPrice />
          </View>
          <PremiumSlider style={tw`items-center self-stretch gap-6px`} />
        </View>
      </View>
      <PrimaryButton style={tw`self-center mt-auto mb-5`} disabled={!isStepValid} narrow onPress={next}>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
