import { View } from 'react-native'
import { Icon, PrimaryButton, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useOfferPublishedSetup } from './hooks'

export const OfferPublished = () => {
  const { goToOffer, closeAction } = useOfferPublishedSetup()

  return (
    <View style={tw`items-center justify-between h-full px-9 pb-7`}>
      <View style={tw`justify-center flex-shrink w-full h-full`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('offer.published.title')}</Text>
        <View style={tw`flex-row items-center gap-6 mt-8`}>
          <Icon id="checkCircleInverted" style={tw`w-16 h-16`} color={tw`text-primary-background-light`.color} />
          <Text style={tw`flex-shrink body-l text-primary-background-light`}>{i18n('offer.published.description')}</Text>
        </View>
      </View>
      <PrimaryButton white wide onPress={goToOffer}>
        {i18n('showOffer')}
      </PrimaryButton>
      <PrimaryButton style={tw`mt-3`} white wide border onPress={closeAction}>
        {i18n('close')}
      </PrimaryButton>
    </View>
  )
}
