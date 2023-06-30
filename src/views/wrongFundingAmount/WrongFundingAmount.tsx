import { View } from 'react-native'
import { RefundEscrowSlider } from '../../components/offer'
import tw from '../../styles/tailwind'
import { WrongFundingAmountSummary } from './components/WrongFundingAmountSummary'
import { ContinueTradeSlider } from './components/ContinueTradeSlider'
import { useWrongFundingAmountSetup } from './hooks/useWrongFundingAmountSetup'

export const WrongFundingAmount = () => {
  const { sellOffer } = useWrongFundingAmountSetup()

  return (
    <View style={tw`justify-between flex-grow px-6 pt-5 pb-3`}>
      <WrongFundingAmountSummary {...{ sellOffer }} />
      <View style={tw`items-center gap-3`}>
        <ContinueTradeSlider {...{ sellOffer }} />
        <RefundEscrowSlider {...{ sellOffer }} />
      </View>
    </View>
  )
}
