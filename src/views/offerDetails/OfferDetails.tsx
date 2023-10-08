import { Header, Screen, Text } from '../../components'
import tw from '../../styles/tailwind'
import { isSellOffer } from '../../utils/offer'

import { View } from 'react-native'
import { useWalletLabel } from '../../components/offer/useWalletLabel'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import i18n from '../../utils/i18n'
import { EscrowButton } from '../contract/EscrowButton'
import { LoadingScreen } from '../loading/LoadingScreen'
import { isCanceledOffer } from './helpers/isCanceledOffer'

export const OfferDetails = () => {
  const { offerId } = useRoute<'offer'>().params
  const { offer } = useOfferDetails(offerId)

  return isCanceledOffer(offer) && isSellOffer(offer) ? <OfferDetailsScreen offer={offer} /> : <LoadingScreen />
}

function OfferDetailsHeader ({ amount, premium }: { amount: number; premium: number }) {
  return (
    <Header
      title={i18n('yourTrades.offerCanceled.subtitle')}
      theme={'cancel'}
      subtitle={<Header.Subtitle amount={amount} premium={premium} viewer={'seller'} theme={'cancel'} />}
    />
  )
}

function OfferDetailsScreen ({ offer }: { offer: SellOffer }) {
  const walletLabel = useWalletLabel({ label: offer.walletLabel, address: offer.returnAddress })
  return (
    <Screen header={<OfferDetailsHeader {...offer} />}>
      <View style={tw`justify-center grow`}>
        <Text style={tw.md`body-l`}>{i18n('contract.seller.refunded', walletLabel)}</Text>
      </View>

      <View style={tw`h-10`}>{!!offer.escrow && <EscrowButton style={tw`self-center`} escrow={offer.escrow} />}</View>
    </Screen>
  )
}
