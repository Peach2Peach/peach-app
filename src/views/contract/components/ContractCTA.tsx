import { WarningButton } from '../../../components/buttons'
import { ConfirmSlider } from '../../../components/inputs'
import { UnlockedSlider } from '../../../components/inputs/confirmSlider/ConfirmSlider'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useConfirmCancelTrade } from '../../../popups/tradeCancelation'
import { useConfirmTradeCancelationPopup } from '../../../popups/tradeCancelation/useConfirmTradeCancelationPopup'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import i18n from '../../../utils/i18n'
import { extendPaymentTimer } from '../../../utils/peachAPI'
import { shouldShowConfirmCancelTradeRequest } from '../../../utils/popup'
import { useContractContext } from '../context'

type Props = {
  requiredAction: ContractAction
  actionPending: boolean
  postConfirmPaymentBuyer: () => void
  postConfirmPaymentSeller: () => void
}
export const ContractCTA = ({
  requiredAction,
  actionPending,
  postConfirmPaymentBuyer,
  postConfirmPaymentSeller,
}: Props) => {
  const { showConfirmTradeCancelation } = useConfirmTradeCancelationPopup()
  const { contract, view } = useContractContext()

  if (shouldShowConfirmCancelTradeRequest(contract, view)) return (
    <WarningButton onPress={() => showConfirmTradeCancelation(contract)}>{i18n('contract.respond')}</WarningButton>
  )

  if (view === 'seller' && isPaymentTooLate(contract)) {
    return (
      <>
        <CancelTradeSlider />
        <ExtendTimerSlider />
      </>
    )
  }

  if (view === 'buyer' && requiredAction === 'confirmPayment') {
    return <UnlockedSlider label={i18n('contract.payment.made')} />
  }

  if (view === 'seller' && requiredAction === 'sendPayment') {
    return (
      <ConfirmSlider enabled={false} onConfirm={() => {}} label1={i18n('offer.requiredAction.waiting', i18n('buyer'))} />
    )
  }
  if (view === 'buyer' && requiredAction === 'sendPayment') {
    return (
      <ConfirmSlider
        enabled={!actionPending}
        onConfirm={postConfirmPaymentBuyer}
        label1={i18n('contract.payment.buyer.confirm')}
        label2={i18n('contract.payment.made')}
      />
    )
  }
  if (view === 'seller' && requiredAction === 'confirmPayment') return (
    <ConfirmSlider
      enabled={!actionPending}
      onConfirm={postConfirmPaymentSeller}
      label1={i18n('contract.payment.confirm')}
      label2={i18n('contract.payment.received')}
    />
  )

  return <></>
}

function CancelTradeSlider () {
  const { cancelSeller } = useConfirmCancelTrade()
  const { contract } = useContractContext()

  const onConfirm = () => cancelSeller(contract)

  return (
    <ConfirmSlider
      enabled
      iconId="xCircle"
      onConfirm={onConfirm}
      label1={i18n('contract.seller.paymentTimerHasRunOut.cancelTrade')}
    />
  )
}

function ExtendTimerSlider () {
  const { contract } = useContractContext()
  const showError = useShowErrorBanner()

  const onConfirm = async () => {
    const [result, err] = await extendPaymentTimer({ contractId: contract.id })
    if (!result || err) showError(err?.error)
  }

  return (
    <ConfirmSlider
      iconId="arrowRightCircle"
      enabled
      onConfirm={onConfirm}
      label1={i18n('contract.seller.giveMoreTime')}
    />
  )
}
