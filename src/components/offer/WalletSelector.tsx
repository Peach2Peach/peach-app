import { isPublishedOffer } from '../../utils/offer'
import { SelectWallet } from './SelectWallet'
import { WalletLabel } from './WalletLabel'

type Props = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft | SellOffer | SellOfferDraft
}
export const WalletSelector = ({ offer, style }: Props) => {
  if (isPublishedOffer(offer)) {
    const address = offer.type === 'bid' ? offer.releaseAddress : offer.returnAddress
    return <WalletLabel label={offer.walletLabel} address={address} style={style} />
  }

  const type = offer.type === 'bid' ? 'payout' : 'refund'
  return <SelectWallet type={type} style={style} />
}
