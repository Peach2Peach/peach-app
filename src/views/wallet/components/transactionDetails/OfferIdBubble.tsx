import { OfferSummary } from '../../../../../peach-api/src/@types/offer'
import { Bubble } from '../../../../components/bubble/Bubble'
import { useTradeNavigation } from '../../../../hooks/useTradeNavigation'
import { offerIdToHex } from '../../../../utils/offer/offerIdToHex'

type Props = {
  offer: OfferSummary
}

export const OfferIdBubble = ({ offer }: Props) => {
  const goToOffer = useTradeNavigation(offer)
  const tradeId = offerIdToHex(offer.id)

  return (
    <Bubble color="primary-mild" iconId="info" onPress={goToOffer}>
      {tradeId}
    </Bubble>
  )
}
