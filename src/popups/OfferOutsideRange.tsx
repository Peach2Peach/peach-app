import PeachText from '../components/text/Text'
import i18n from '../utils/i18n'
import { offerIdToHex } from '../utils/offer/offerIdToHex'

type Props = {
  offerId: string
}

export const OfferOutsideRange = ({ offerId }: Props) => (
  <PeachText>{i18n('notification.offer.outsideRange.text', offerIdToHex(offerId))}</PeachText>
)
