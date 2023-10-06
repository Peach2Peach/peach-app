import { useCallback, useState } from 'react'
import { WarningButton } from '../../../components/buttons'
import { ConfirmSlider } from '../../../components/inputs'
import { UnlockedSlider } from '../../../components/inputs/confirmSlider/ConfirmSlider'
import { useRoute } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useConfirmCancelTrade } from '../../../popups/tradeCancelation'
import { useConfirmTradeCancelationPopup } from '../../../popups/tradeCancelation/useConfirmTradeCancelationPopup'
import { getSellOfferFromContract, verifyAndSignReleaseTx } from '../../../utils/contract'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import i18n from '../../../utils/i18n'
import { confirmPayment, extendPaymentTimer } from '../../../utils/peachAPI'
import { shouldShowConfirmCancelTradeRequest } from '../../../utils/popup'
import { getEscrowWalletForOffer } from '../../../utils/wallet'
import { useContractContext } from '../context'

type Props = {
  requiredAction: ContractAction
}
export const ContractCTA = ({ requiredAction }: Props) => {
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
    return <PaymentMadeSlider />
  }
  if (view === 'seller' && requiredAction === 'confirmPayment') return <PaymentReceivedSlider />

  return <></>
}

function PaymentMadeSlider () {
  const { contractId } = useRoute<'contract'>().params
  const showError = useShowErrorBanner()
  const { saveAndUpdate } = useContractContext()

  const postConfirmPaymentBuyer = useCallback(async () => {
    const [, err] = await confirmPayment({ contractId })

    if (err) {
      showError(err.error)
    }

    saveAndUpdate({ paymentMade: new Date() })
  }, [contractId, saveAndUpdate, showError])

  return (
    <ConfirmSlider
      onConfirm={postConfirmPaymentBuyer}
      label1={i18n('contract.payment.buyer.confirm')}
      label2={i18n('contract.payment.made')}
    />
  )
}

function PaymentReceivedSlider () {
  const [actionPending, setActionPending] = useState(false)
  const { contract, saveAndUpdate } = useContractContext()
  const showError = useShowErrorBanner()
  const postConfirmPaymentSeller = useCallback(async () => {
    if (!contract) return
    setActionPending(true)

    const sellOffer = getSellOfferFromContract(contract)
    const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
      contract,
      sellOffer,
      getEscrowWalletForOffer(sellOffer),
    )

    if (!releaseTransaction) {
      setActionPending(false)
      showError(errorMsg)
      return
    }

    const [result, err] = await confirmPayment({
      contractId: contract.id,
      releaseTransaction,
      batchReleasePsbt,
    })

    setActionPending(false)

    if (err) {
      showError(err.error)
      return
    }

    saveAndUpdate({
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
    })
  }, [contract, saveAndUpdate, showError])

  return (
    <ConfirmSlider
      enabled={!actionPending}
      onConfirm={postConfirmPaymentSeller}
      label1={i18n('contract.payment.confirm')}
      label2={i18n('contract.payment.received')}
    />
  )
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
