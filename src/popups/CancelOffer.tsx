import { Text } from '../components'
import i18n from '../utils/i18n'

type Props = Pick<BuyOffer | SellOffer, 'type'>

export const CancelOffer = ({ type }: Props) => (
  <Text>{i18n(type === 'bid' ? 'search.popups.cancelOffer.text.buy' : 'offer.cancel.popup.description')}</Text>
)
