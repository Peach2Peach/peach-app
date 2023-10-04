import { NETWORK } from '@env'
import { View } from 'react-native'
import { NewButton as Button } from '../../../components/buttons/Button'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { showAddress, showTransaction } from '../../../utils/bitcoin'
import { getContractChatNotification } from '../../../utils/chat'
import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { PendingPayoutInfo } from './PendingPayoutInfo'
import { TradeInformation } from './TradeInformation'

export const TradeSummary = () => {
  const { contract, view, showBatchInfo } = useContractContext()
  const { batchInfo, releaseTxId } = contract

  if (showBatchInfo) return <PendingPayoutInfo />

  return (
    <View style={[tw`gap-4 pb-2 grow`, tw.md`gap-8`]}>
      <TradeInformation />

      <View style={tw`flex-row items-center justify-center gap-6 mt-auto`}>
        <EscrowButton />
        <ChatButton />
      </View>
      {shouldShowPayoutPending(view, batchInfo, releaseTxId) && <PayoutPendingButton />}
    </View>
  )
}

function shouldShowPayoutPending (view: string, batchInfo: BatchInfo | undefined, releaseTxId: string | undefined) {
  return view === 'buyer' && !!batchInfo && !batchInfo.completed && !releaseTxId
}

function PayoutPendingButton () {
  const { contract, showBatchInfo, toggleShowBatchInfo } = useContractContext()
  const { disputeActive } = contract

  return (
    <Button style={[tw`self-center`, disputeActive && tw`bg-error-main`]} iconId="eye" onPress={toggleShowBatchInfo}>
      {i18n(showBatchInfo ? 'contract.summary.tradeDetails' : 'offer.requiredAction.payoutPending')}
    </Button>
  )
}

function EscrowButton () {
  const { releaseTxId, escrow, disputeActive } = useContractContext().contract
  const openEscrow = () => (releaseTxId ? showTransaction(releaseTxId, NETWORK) : showAddress(escrow, NETWORK))

  return (
    <Button
      iconId="externalLink"
      style={tw`flex-1 bg-transparent`}
      textColor={disputeActive ? tw`text-error-light` : tw`text-primary-main`}
      ghost
      onPress={openEscrow}
    >
      {i18n('escrow')}
    </Button>
  )
}

function ChatButton () {
  const { contract } = useContractContext()
  const navigation = useNavigation()
  const messages = getContractChatNotification(contract)
  const goToChat = () => navigation.push('contractChat', { contractId: contract.id })
  const isDispute = contract.disputeActive
  return (
    <Button
      style={[tw`flex-1`, isDispute && tw`bg-error-main`]}
      iconId={messages === 0 ? 'messageCircle' : 'messageFull'}
      onPress={goToChat}
    >
      {messages === 0 ? i18n('chat') : `${messages} ${i18n('contract.unread')}`}
    </Button>
  )
}
