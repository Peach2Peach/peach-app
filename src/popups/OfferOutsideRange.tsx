import { Text } from '../components'
import i18n from '../utils/i18n'
import { offerIdToHex } from '../utils/offer/offerIdToHex'

type Props = {
  offerId: string
}

export const OfferOutsideRange = ({ offerId }: Props) => (
  <Text>{i18n('notification.offer.outsideRange.text', offerIdToHex(offerId))}</Text>
)
