import { NETWORK } from '@env'
import { View } from 'react-native'
import { PrimaryButton } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { getContractChatNotification } from '../../utils/chat'
import i18n from '../../utils/i18n'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { ResolveDisputeSliders } from './ResolveDisputeSliders'
import { ContractCTA } from './components/ContractCTA'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { useContractContext } from './context'

type Props = ComponentProps & {
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentSeller: () => void
  hasNewOffer: boolean
  goToNewOffer: () => void
}
export const ContractActions = ({ style, hasNewOffer, goToNewOffer, ...contractCTAProps }: Props) => {
  const { contract, view } = useContractContext()
  const { isEmailRequired, tradeStatus, disputeWinner, batchInfo, releaseTxId } = contract
  const shouldShowReleaseEscrow = tradeStatus === 'releaseEscrow' && !!disputeWinner
  return (
    <View style={[tw`gap-3`, style]}>
      <View style={tw`flex-row items-center justify-center gap-6`}>
        <EscrowButton />
        <ChatButton />
      </View>
      {shouldShowPayoutPending(view, batchInfo, releaseTxId) && <PayoutPendingButton />}
      <ContractStatusInfo {...contractCTAProps} />
      {!!isEmailRequired && <ProvideEmailButton style={tw`self-center`} />}
      {hasNewOffer && <PrimaryButton onPress={goToNewOffer}>{i18n('contract.goToNewTrade')}</PrimaryButton>}
      {!shouldShowReleaseEscrow && <ContractCTA {...{ ...contractCTAProps }} />}
      {tradeStatus === 'refundOrReviveRequired' && !!disputeWinner && <ResolveDisputeSliders />}
      {shouldShowReleaseEscrow && <ReleaseEscrowSlider {...{ contract }} />}
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
