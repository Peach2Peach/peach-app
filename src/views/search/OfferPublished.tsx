import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const OfferPublished = () => {
  const { isSellOffer, shouldGoBack, offerId } = useRoute<'offerPublished'>().params
  const navigation = useNavigation()
  const goBackHome = () => navigation.replace(isSellOffer ? 'sell' : 'buy')
  const goToOffer = () => navigation.replace('search', { offerId })
  const goBack = () => navigation.goBack()

  return (
    <View style={tw`items-center justify-between h-full px-9 pb-7`}>
      <View style={tw`justify-center flex-shrink w-full h-full`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('offer.published.title')}</Text>
        <View style={tw`flex-row items-center gap-6 mt-8`}>
          <Icon id="checkCircleInverted" style={tw`w-16 h-16`} color={tw`text-primary-background-light`.color} />
          <Text style={tw`flex-shrink body-l text-primary-background-light`}>{i18n('offer.published.description')}</Text>
        </View>
      </View>
      <View style={tw`items-stretch gap-3`}>
        <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToOffer}>
          {i18n('showOffer')}
        </Button>
        <Button ghost onPress={shouldGoBack ? goBack : goBackHome}>
          {i18n('close')}
        </Button>
      </View>
    </View>
  )
}
