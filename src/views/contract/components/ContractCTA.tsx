import React, { ReactElement } from 'react'
import { PrimaryButton } from '../../../components'
import { WarningButton } from '../../../components/buttons'
import { SlideToUnlock } from '../../../components/inputs'
import { useNavigation } from '../../../hooks'
import { useConfirmTradeCancelationOverlay } from '../../../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
import { usePaymentTooLateOverlay } from '../../../overlays/usePaymentTooLateOverlay'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { shouldShowConfirmCancelTradeRequest } from '../../../utils/overlay'
import { getPaymentExpectedBy } from '../helpers/getPaymentExpectedBy'
import { getTimerStart } from '../helpers/getTimerStart'

type ContractCTAProps = ComponentProps & {
  contract: Contract
  view: ContractViewer
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export default ({
  contract,
  view,
  requiredAction,
  actionPending,
  postConfirmPaymentBuyer,
  postConfirmPaymentSeller,
}: ContractCTAProps): ReactElement => {
  const navigation = useNavigation()
  const goToChat = () => navigation.push('contractChat', { contractId: contract.id })
  const showPaymentTooLateOverlay = usePaymentTooLateOverlay()
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()

  if (contract.disputeActive) return (
    <WarningButton onPress={goToChat} iconId="alertOctagon">
      {i18n('contract.disputeActive')}
    </WarningButton>
  )
  if (shouldShowConfirmCancelTradeRequest(contract, view)) return (
    <WarningButton onPress={() => showConfirmTradeCancelation(contract)}>{i18n('contract.respond')}</WarningButton>
  )
  if (view === 'buyer' && requiredAction === 'confirmPayment') return (
    <PrimaryButton disabled iconId="send">
      {i18n('contract.payment.sent')}
    </PrimaryButton>
  )

  if (view === 'seller' && requiredAction === 'sendPayment') return (
    <PrimaryButton disabled iconId="watch">
      {i18n('contract.payment.notYetSent')}
    </PrimaryButton>
  )
  if (view === 'buyer' && requiredAction === 'sendPayment') {
    const paymentExpectedBy = getPaymentExpectedBy(contract)
    if (Date.now() < paymentExpectedBy) {
      return (
        <SlideToUnlock
          style={tw`w-[260px]`}
          disabled={actionPending}
          onUnlock={postConfirmPaymentBuyer}
          label1={i18n('contract.payment.confirm')}
          label2={i18n('contract.payment.made')}
        />
      )
    }
    return (
      <WarningButton onPress={showPaymentTooLateOverlay} iconId="alertOctagon">
        {i18n('contract.timer.paymentTimeExpired.button.buyer')}
      </WarningButton>
    )
  }
  if (view === 'seller' && requiredAction === 'confirmPayment') return (
    <SlideToUnlock
      style={tw`w-[260px]`}
      disabled={actionPending}
      onUnlock={postConfirmPaymentSeller}
      label1={i18n('contract.payment.confirm')}
      label2={i18n('contract.payment.received')}
    />
  )

  return <></>
}
