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
      <View style={tw`px-8`}>
        <HorizontalLine style={tw`mb-2`} />
        <BitcoinPriceStats />
      </View>

      <View style={tw`items-center flex-shrink h-full pb-7`}>
        <View style={tw`justify-center flex-grow`}>
          <View style={tw`px-8`}>
            <Text style={tw`text-center h5`}>{i18n('sell.premium.title')}</Text>
            <View style={tw`flex-row justify-center w-full`}>
              <Text style={tw`pr-2 subtitle-1`}>{i18n('search.sellOffer')}</Text>
              <CurrentOfferAmount />
            </View>
            <PremiumInput style={tw`mt-8`} />
            <CurrentOfferPrice style={tw`mt-1`} />
          </View>
          <PremiumSlider style={tw`px-4 mt-6`} />
        </View>
        <PrimaryButton testID="navigation-next" disabled={!isStepValid} narrow onPress={next}>
          {i18n('next')}
        </PrimaryButton>
      </View>
    </View>
  )
}
