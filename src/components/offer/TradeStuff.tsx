import { View } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import { ChatButton } from '../chat/ChatButton'
import { Escrow } from './Escrow'
import { PaymentMethod } from './PaymentMethod'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { TradeStuffSeparator } from './TradeStuffSeparator'

export const TradeStuff = ({ contract, style }: { contract: Contract } & ComponentProps) => {
  const appLink = APPLINKS[contract.paymentMethod]

  return (
    <View style={style}>
      <TradeStuffSeparator {...contract} />
      <View style={tw`flex-row justify-start gap-2 mt-6px`}>
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
    </View>
  )
}
