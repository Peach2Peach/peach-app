import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { RefundEscrowSlider } from '../../components/offer'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import { isSellOffer, offerIdToHex } from '../../utils/offer'
import { ContinueTradeSlider } from './components/ContinueTradeSlider'
import { WrongFundingAmountSummary } from './components/WrongFundingAmountSummary'

export const WrongFundingAmount = () => {
  const { offerId } = useRoute<'fundEscrow'>().params
  const { offer } = useOfferDetails(offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined

  return (
    <Screen header={<Header title={offerIdToHex(offerId)} />}>
      <WrongFundingAmountSummary {...{ sellOffer }} />
      <View style={tw`items-center gap-3`}>
        <ContinueTradeSlider {...{ sellOffer }} />
        <RefundEscrowSlider {...{ sellOffer }} />
      </View>
    </Screen>
  )
}
