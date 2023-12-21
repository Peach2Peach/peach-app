import { Bubble } from '../../../../components/bubble'
import { useNavigateToOfferOrContract } from '../../../../hooks/useNavigateToOfferOrContract'
import { offerIdToHex } from '../../../../utils/offer/offerIdToHex'

type Props = {
  offer: OfferSummary
}

export const OfferIdBubble = ({ offer }: Props) => {
  const goToOffer = useNavigateToOfferOrContract(offer)
  const tradeId = offerIdToHex(offer.id)

  return (
    <Bubble color="primary-mild" iconId="info" onPress={goToOffer}>
      {tradeId}
    </Bubble>
  )
}
