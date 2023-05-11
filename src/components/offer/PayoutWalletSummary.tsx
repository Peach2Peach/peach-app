import { View } from 'react-native'
import { TradeSeparator } from './TradeSeparator'
import i18n from '../../utils/i18n'
import { isPublishedOffer, isSellOffer } from '../../utils/offer'
import { WalletLabel } from './WalletLabel'
import { SelectWallet } from './SelectWallet'
import tw from '../../styles/tailwind'

type Props = {
  offer: BuyOffer | BuyOfferDraft | SellOffer | SellOfferDraft
  walletLabel?: string
  address?: string
}
export const PayoutWalletSummary = ({ offer, walletLabel, address }: Props) => {
  const type = offer.type === 'ask' ? 'refund' : 'payout'
  return (
    <View>
      <TradeSeparator text={i18n(`${type}.wallet`)} />
      {isPublishedOffer(offer) ? (
        <WalletLabel label={walletLabel} address={address} style={tw`mt-1`} />
      ) : (
        <SelectWallet type={type} style={tw`mt-1`} />
      )}
    </View>
  )
}
