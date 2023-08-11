import { View } from 'react-native'
import { PaymentMethod } from '../../../components/offer/PaymentMethod'
import { APPLINKS } from '../../../constants'
import tw from '../../../styles/tailwind'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { useContractContext } from '../context'
import { ChatButton } from './ChatButton'
import { Escrow } from './Escrow'
import { TogglePayoutPending } from './TogglePayoutPending'
import { TradeStuffSeparator } from './TradeStuffSeparator'

const shouldShowPayoutPending = (view: string, batchInfo: any, releaseTxId: any) =>
  view === 'buyer' && !!batchInfo && !batchInfo.completed && !releaseTxId

export const TradeStuff = ({ style }: ComponentProps) => {
  const { contract, view } = useContractContext()
  const { escrow, paymentMethod, releaseTxId, batchInfo, disputeActive } = contract
  const appLink = APPLINKS[paymentMethod]

  return (
    <View style={style}>
      <TradeStuffSeparator />
      <View style={tw`flex-row flex-wrap justify-start gap-2 mt-6px`}>
        {shouldShowPayoutPending(view, batchInfo, releaseTxId) && <TogglePayoutPending />}
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
