import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const mutatian = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contractId])
      queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          paymentMade: new Date(),
          tradeStatus: 'confirmPaymentRequired' as const,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    mutationFn: async () => {
      const [, err] = await confirmPayment({ contractId })
      if (err) throw err
    },
    onError: (err: APIError, _variables, context) => {
      queryClient.setQueryData(['contract', contractId], context?.previousData)
      showError(err.error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contractId])
    },
  })

  return (
    <ConfirmSlider
      onConfirm={() => mutatian.mutate()}
      label1={i18n('contract.payment.buyer.confirm')}
      label2={i18n('contract.payment.made')}
    />
  )
}

function PaymentReceivedSlider () {
  const { contract } = useContractContext()
  const showError = useShowErrorBanner()

  const queryClient = useQueryClient()
  const mutatian = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contract.id] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contract.id])
      queryClient.setQueryData(['contract', contract.id], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          paymentReceived: new Date(),
          tradeStatus: 'rateUser' as const,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    mutationFn: async () => {
      const sellOffer = getSellOfferFromContract(contract)
      const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
        contract,
        sellOffer,
        getEscrowWalletForOffer(sellOffer),
      )

      if (!releaseTransaction) {
        throw new Error(errorMsg)
      }

      const [, err] = await confirmPayment({
        contractId: contract.id,
        releaseTransaction,
        batchReleasePsbt,
      })
      if (err) throw new Error(err.error)
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(['contract', contract.id], context?.previousData)
      showError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contract.id])
    },
  })

  return (
    <ConfirmSlider
      enabled={!mutatian.isLoading}
      onConfirm={() => mutatian.mutate()}
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
