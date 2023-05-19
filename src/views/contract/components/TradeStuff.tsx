import { View } from 'react-native'
import { APPLINKS } from '../../../constants'
import tw from '../../../styles/tailwind'
import { ChatButton } from '../../../components/chat/ChatButton'
import { Escrow } from './Escrow'
import { PaymentMethod } from '../../../components/offer/PaymentMethod'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { TradeStuffSeparator } from './TradeStuffSeparator'
import { useContractContext } from '../context'

export const TradeStuff = ({ style }: ComponentProps) => {
  const { escrow, paymentMethod, releaseTxId, disputeActive } = useContractContext().contract
  const appLink = APPLINKS[paymentMethod]

  return (
    <View style={style}>
      <TradeStuffSeparator />
      <View style={tw`flex-row justify-start gap-2 mt-6px`}>
        {(!!escrow || !!releaseTxId) && <Escrow />}
        {!!appLink && (
          <PaymentMethod
            paymentMethod={isCashTrade(paymentMethod) ? 'cash' : paymentMethod}
            isDispute={disputeActive}
            showLink
          />
        )}
        <ChatButton />
      </View>
    </View>
  )
}
