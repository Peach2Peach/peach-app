import { Bubble } from '../../../../components/bubble'
import { useNavigateToOfferOrContract } from '../../../../hooks'
import { offerIdToHex } from '../../../../utils/offer'

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
