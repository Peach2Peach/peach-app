import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { ConfirmSlider } from '../../components/inputs'
import { MSINANHOUR } from '../../constants'
import { useRoute } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { cancelContractAsSeller } from '../../popups/tradeCancelation/helpers/cancelContractAsSeller'
import { useStartRefundPopup } from '../../popups/useStartRefundPopup'
import { getSellOfferFromContract, verifyAndSignReleaseTx } from '../../utils/contract'
import { isPaymentTooLate } from '../../utils/contract/status/isPaymentTooLate'
import i18n from '../../utils/i18n'
import {
  confirmContractCancelation,
  confirmPayment,
  extendPaymentTimer,
  rejectContractCancelation,
} from '../../utils/peachAPI'
import { getEscrowWalletForOffer } from '../../utils/wallet'
import { useContractContext } from './context'
import { useReleaseEscrow } from './hooks/useReleaseEscrow'
import { useRepublishOffer } from './hooks/useRepublishOffer'

export function RepublishOfferSlider () {
  const { contract } = useContractContext()
  const republishOffer = useRepublishOffer()
  return <ConfirmSlider onConfirm={() => republishOffer(contract)} label1={i18n('republishOffer')} iconId="refreshCw" />
}
export function RefundEscrowSlider () {
  const { contract } = useContractContext()
  const startRefund = useStartRefundPopup()
  return (
    <ConfirmSlider
      onConfirm={() => startRefund(getSellOfferFromContract(contract))}
      label1={i18n('refundEscrow')}
      iconId="rotateCounterClockwise"
    />
  )
}

export function PaymentMadeSlider () {
  const { contractId } = useRoute<'contract'>().params
  const { contract } = useContractContext()

  const mutation = useContractMutation(
    { paymentMade: new Date(), tradeStatus: 'confirmPaymentRequired' },
    {
      mutationFn: async () => {
        const [, err] = await confirmPayment({ contractId })
        if (err) throw new Error(err.error)
      },
    },
  )

  return (
    <ConfirmSlider
      enabled={!mutation.isLoading && !isPaymentTooLate(contract)}
      onConfirm={() => mutation.mutate()}
      label1={i18n('contract.payment.buyer.confirm')}
      label2={i18n('contract.payment.made')}
    />
  )
}

export function PaymentReceivedSlider () {
  const { contract } = useContractContext()
  const mutation = useContractMutation(
    { paymentConfirmed: new Date(), tradeStatus: 'rateUser' },
    {
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
    },
  )

  return (
    <ConfirmSlider
      enabled={!mutation.isLoading}
      onConfirm={() => mutation.mutate()}
      label1={i18n('contract.payment.confirm')}
      label2={i18n('contract.payment.received')}
    />
  )
}
export function CancelTradeSlider () {
  const { contract } = useContractContext()
  const { mutate } = useContractMutation(
    { canceled: true, tradeStatus: 'refundOrReviveRequired' },
    {
      mutationFn: async () => {
        const result = await cancelContractAsSeller(contract)
        if (!result || result.isError()) throw new Error(result.error)
      },
    },
  )

  return (
    <ConfirmSlider
      iconId="xCircle"
      onConfirm={() => mutate()}
      label1={i18n('contract.seller.paymentTimerHasRunOut.cancelTrade')}
    />
  )
}
export function ExtendTimerSlider () {
  const { contractId } = useRoute<'contract'>().params
  const { mutate } = useContractMutation(
    { paymentExpectedBy: new Date(Date.now() + MSINANHOUR * 12) },
    {
      mutationFn: async () => {
        const [result, err] = await extendPaymentTimer({ contractId })
        if (!result || err) throw new Error(err?.error || 'Error extending payment timer')
      },
    },
  )

  return (
    <ConfirmSlider iconId="arrowRightCircle" onConfirm={() => mutate()} label1={i18n('contract.seller.giveMoreTime')} />
  )
}
export function ResolveCancelRequestSliders () {
  const { contractId } = useRoute<'contract'>().params

  const { mutate: continueTrade } = useContractMutation(
    { cancelationRequested: false },
    {
      mutationFn: async () => {
        const [, err] = await rejectContractCancelation({ contractId })
        if (err) throw new Error(err.error)
      },
    },
  )

  const { mutate: cancelTrade } = useContractMutation(
    { canceled: true, cancelationRequested: false },
    {
      mutationFn: async () => {
        const [, err] = await confirmContractCancelation({ contractId })
        if (err) throw new Error(err.error)
      },
    },
  )

  return (
    <>
      <ConfirmSlider
        onConfirm={() => cancelTrade()}
        label1={i18n('contract.cancelationRequested.agree')}
        iconId="xCircle"
      />
      <ConfirmSlider
        onConfirm={() => continueTrade()}
        label1={i18n('contract.cancelationRequested.continueTrade')}
        iconId="arrowRightCircle"
      />
    </>
  )
}
export function ReleaseEscrowSlider () {
  const { contract } = useContractContext()
  const { mutate } = useReleaseEscrow(contract)

  return <ConfirmSlider label1={i18n('releaseEscrow')} onConfirm={() => mutate()} />
}

function useContractMutation (optimisticContract: Partial<Contract>, options: UseMutationOptions) {
  const { contractId } = useRoute<'contract'>().params
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()

  return useMutation({
    ...options,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contractId])
      queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          ...optimisticContract,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    onError: (err: Error, _variables: void, context: { previousData: Contract | undefined } | undefined) => {
      queryClient.setQueryData(['contract', contractId], context?.previousData)
      showError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contractId])
      queryClient.invalidateQueries(['contractSummaries'])
    },
  })
}
