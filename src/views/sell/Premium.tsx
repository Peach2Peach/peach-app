import { View } from 'react-native'
import { BitcoinPriceStats, HorizontalLine, PremiumSlider, PrimaryButton, SatsFormat, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { priceFormat } from '../../utils/string'
import { PremiumInput } from './components/PremiumInput'
import { usePremiumSetup } from './hooks/usePremiumSetup'
import { useNavigation } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { shallow } from 'zustand/shallow'

export const Premium = () => {
  const [amount, isStepValid] = useOfferPreferences((state) => [state.sellAmount, state.canContinue.premium], shallow)
  const { currentPrice, displayCurrency } = usePremiumSetup()

  const navigation = useNavigation()
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
              <SatsFormat
                sats={amount}
                bitcoinLogoStyle={tw`w-3 h-3 mr-1`}
                style={tw`subtitle-1`}
                satsStyle={tw`font-normal body-s`}
              />
            </View>
            <PremiumInput style={tw`mt-8`} />
            {!!currentPrice && (
              <Text style={tw`mt-1 text-center text-black-2`}>
                ({i18n('sell.premium.currently', `${priceFormat(currentPrice)} ${displayCurrency}`)})
              </Text>
            )}
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
