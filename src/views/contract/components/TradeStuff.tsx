import { View } from 'react-native'
import { PaymentMethod } from '../../../components/offer/PaymentMethod'
import { APPLINKS } from '../../../paymentMethods'
import tw from '../../../styles/tailwind'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { useContractContext } from '../context'
import { ChatButton } from './ChatButton'
import { Escrow } from './Escrow'
import { TradeStuffSeparator } from './TradeStuffSeparator'

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
