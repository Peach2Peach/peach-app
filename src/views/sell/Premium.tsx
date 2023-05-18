import { View } from 'react-native'
import { PremiumSlider, PrimaryButton, SatsFormat, Text } from '../../components'
import { NumberInput } from '../../components/inputs'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { priceFormat } from '../../utils/string'
import { SellViewProps } from './SellPreferences'
import { usePremiumSetup } from './hooks/usePremiumSetup'

export default ({ offerDraft, setOfferDraft, next }: SellViewProps) => {
  const { premium, updatePremium, currentPrice, displayCurrency, stepValid } = usePremiumSetup(offerDraft, setOfferDraft)
  return (
    <View style={tw`items-center flex-shrink h-full pb-7`}>
      <View style={tw`justify-center flex-grow`}>
        <View style={tw`px-8`}>
          <Text style={tw`text-center h5`}>{i18n('sell.premium.title')}</Text>
          <View style={tw`flex-row justify-center w-full`}>
            <Text style={tw`pr-2 subtitle-1`}>{i18n('search.sellOffer')}</Text>
            <SatsFormat
              sats={offerDraft.amount}
              bitcoinLogoStyle={tw`w-3 h-3 mr-1`}
              style={tw`subtitle-1`}
              satsStyle={tw`font-normal body-s`}
            />
          </View>
          <View style={tw`flex-row items-center justify-center mt-8`}>
            <Text
              style={[
                tw`leading-2xl`,
                premium === '0' ? {} : offerDraft.premium > 0 ? tw`text-success-main` : tw`text-primary-main`,
              ]}
            >
              {i18n(offerDraft.premium > 0 ? 'sell.premium' : 'sell.discount')}:
            </Text>
            <View style={tw`h-10 ml-2`}>
              <NumberInput
                style={tw`w-24`}
                inputStyle={tw`text-right`}
                value={premium || '0'}
                onChange={updatePremium}
                icons={[['percent', () => {}]]}
              />
            </View>
          </View>
          {!!currentPrice && (
            <Text style={tw`mt-1 text-center text-black-2`}>
              ({i18n('sell.premium.currently', `${displayCurrency} ${priceFormat(currentPrice)}`)})
            </Text>
          )}
        </View>
        <PremiumSlider style={tw`px-4 mt-6`} value={Number(premium)} onChange={updatePremium} />
      </View>
      <PrimaryButton testID="navigation-next" disabled={!stepValid} narrow onPress={next}>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
