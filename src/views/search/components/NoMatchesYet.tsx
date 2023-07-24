import { View } from 'react-native'
import { Text } from '../../../components'
import { BuyOfferSummary, SellOfferSummary } from '../../../components/offer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isBuyOffer } from '../../../utils/offer'
import { useOfferMatches } from '../hooks'

type Props = {
  offer: BuyOffer | SellOffer
}

export const NoMatchesYet = ({ offer }: Props) => {
  const { isLoading } = useOfferMatches(offer.id)
  if (isLoading) return <></>
  return (
    <View style={tw`gap-8`}>
      <Text style={tw`text-center subtitle-1`}>{i18n('search.weWillNotifyYou')}</Text>
      {isBuyOffer(offer) ? <BuyOfferSummary offer={offer} /> : <SellOfferSummary offer={offer} />}
    </View>
  )
}
