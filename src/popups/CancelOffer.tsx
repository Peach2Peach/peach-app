import PeachText from '../components/text/Text'
import i18n from '../utils/i18n'

type Props = Pick<BuyOffer | SellOffer, 'type'>

export const CancelOffer = ({ type }: Props) => (
  <PeachText>{i18n(type === 'bid' ? 'search.popups.cancelOffer.text.buy' : 'offer.cancel.popup.description')}</PeachText>
)
