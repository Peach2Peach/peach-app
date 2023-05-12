import { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, PeachScrollView, Text } from '../../../components'
import { SellOfferSummary } from '../../../components/offer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type OfferSummaryProps = {
  offer: SellOffer & { tradeStatus: 'offerCanceled' }
} & ComponentProps

export default ({ offer, style }: OfferSummaryProps): ReactElement => (
  <PeachScrollView style={style} contentContainerStyle={tw`pb-10 pt-15`}>
    <View style={tw`flex-row items-center self-center`}>
      <Text style={tw`subtitle-1`}>
        {i18n('yourTrades.offerCanceled.subtitle')}{' '}
        {new Date(offer.creationDate).toLocaleDateString('en-GB')
          .split('/')
          .join(' / ')}
      </Text>
      <Icon id={'xCircle'} style={tw`w-6 h-6 ml-2`} color={tw.color('black-2')} />
    </View>

    <SellOfferSummary offer={offer} style={tw`mt-8 px-7`} />
  </PeachScrollView>
)
