import { View } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import { ChatButton } from '../chat/ChatButton'
import { Escrow } from './Escrow'
import { PaymentMethod } from './PaymentMethod'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'

export const TradeStuff = ({ contract, style }: { contract: Contract } & ComponentProps) => {
  const appLink = APPLINKS[contract.paymentMethod]

  return (
    <View style={[tw`flex-row gap-2`, style]}>
      {(!!contract.escrow || !!contract.releaseTxId) && <Escrow contract={contract} />}
      {!!appLink && (
        <PaymentMethod
          paymentMethod={isCashTrade(contract.paymentMethod) ? 'cash' : contract.paymentMethod}
          isDispute={contract.disputeActive}
          showLink
        />
      )}
      <ChatButton contract={contract} />
    </View>
  )
}
