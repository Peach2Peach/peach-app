import { Text } from '../components'
import i18n from '../utils/i18n'

type Props = {
  offerId: string
  days: string
}

export const BuyOfferExpired = ({ offerId, days }: Props) => (
  <Text>{i18n('notification.offer.buyOfferExpired.text', offerId, days)}</Text>
)
