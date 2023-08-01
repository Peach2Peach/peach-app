import { View } from 'react-native'
import { Icon, PeachScrollView, Screen, Text } from '../../../components'
import { SellOfferSummary } from '../../../components/offer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  offer: SellOffer & { tradeStatus: 'offerCanceled' }
}

export const OfferSummary = ({ offer }: Props) => (
  <Screen>
    <PeachScrollView contentContainerStyle={[tw`py-sm`, tw.md`py-md`]} contentStyle={tw`gap-10px`}>
      <View style={tw`flex-row items-center self-center gap-2`}>
        <Text style={tw`subtitle-1`}>
          {i18n('yourTrades.offerCanceled.subtitle')}{' '}
          {new Date(offer.creationDate).toLocaleDateString('en-GB')
            .split('/')
            .join(' / ')}
        </Text>
        <Icon id={'xCircle'} size={24} color={tw`text-black-2`.color} />
      </View>

      <SellOfferSummary offer={offer} />
    </PeachScrollView>
  </Screen>
)
