import { Text } from '../components'
import i18n from '../utils/i18n'
import { isBuyOffer } from '../utils/offer'

export const CancelOffer = ({ offer }: { offer: BuyOffer | SellOffer }) => {
  const translation = isBuyOffer(offer) ? 'search.popups.cancelOffer.text.buy' : 'offer.cancel.popup.description'
  return <Text>{i18n(translation)}</Text>
}
