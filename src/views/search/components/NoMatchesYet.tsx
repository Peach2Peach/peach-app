import { View } from 'react-native'
import { Text } from '../../../components'
import { BuyOfferSummary, SellOfferSummary } from '../../../components/offer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { isBuyOffer } from '../../../utils/offer'
import { useOfferMatches } from '../hooks/useOfferMatches'

export const NoMatchesYet = ({ offer, style }: { offer: BuyOffer | SellOffer } & ComponentProps) => {
  const { isLoading } = useOfferMatches(offer.id)
  if (isLoading) return <></>
  return (
    <View style={style}>
      <Text style={tw`mb-8 text-center subtitle-1`}>{i18n('search.weWillNotifyYou')}</Text>
      {isBuyOffer(offer) ? <BuyOfferSummary offer={offer} /> : <SellOfferSummary offer={offer} />}
    </View>
  )
}
