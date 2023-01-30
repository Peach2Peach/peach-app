import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PrimaryButton } from '../../../components'
import { WarningButton } from '../../../components/buttons'
import { SlideToUnlock } from '../../../components/inputs'
import { useConfirmTradeCancelationOverlay } from '../../../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { shouldShowConfirmCancelTradeRequest } from '../../../utils/overlay'

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
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
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
  if (view === 'buyer' && requiredAction === 'sendPayment') return (
    <SlideToUnlock
      style={tw`w-[260px]`}
      disabled={actionPending}
      onUnlock={postConfirmPaymentBuyer}
      label1={i18n('contract.payment.confirm')}
      label2={i18n('contract.payment.made')}
    />
  )
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
