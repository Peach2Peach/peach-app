import PeachText from '../components/text/Text'
import i18n from '../utils/i18n'

type Props = {
  offerId: string
  days: string
}

export const BuyOfferExpired = ({ offerId, days }: Props) => (
  <PeachText>{i18n('notification.offer.buyOfferExpired.text', offerId, days)}</PeachText>
)
