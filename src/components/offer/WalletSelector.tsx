import { getWalletType, isPublishedOffer } from '../../utils/offer'
import { TextLabel } from '../text'
import { SelectWallet } from './SelectWallet'
import { WalletLabel } from './WalletLabel'

type Props = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft | SellOffer | SellOfferDraft
}
export const WalletSelector = ({ offer, style }: Props) => {
  if (isPublishedOffer(offer)) {
    const address = offer.type === 'bid' ? offer.releaseAddress : offer.returnAddress
    return (
      <TextLabel style={style}>
        <WalletLabel label={offer.walletLabel} address={address} />
      </TextLabel>
    )
  }

  return <SelectWallet type={getWalletType(offer)} style={style} />
}
