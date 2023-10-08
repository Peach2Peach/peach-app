/* eslint-disable max-lines */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { NewButton as Button, NewButton } from '../../components/buttons/Button'
import { ConfirmSlider } from '../../components/inputs'
import { UnlockedSlider } from '../../components/inputs/confirmSlider/ConfirmSlider'
import { MSINANHOUR } from '../../constants'
import { useNavigation, useRoute, useShowHelp } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { cancelContractAsSeller } from '../../popups/tradeCancelation/helpers/cancelContractAsSeller'
import { useStartRefundPopup } from '../../popups/useStartRefundPopup'
import { useConfigStore } from '../../store/configStore'
import tw from '../../styles/tailwind'
import {
  getNavigationDestinationForContract,
  getOfferIdFromContract,
  getRequiredAction,
  getSellOfferFromContract,
  verifyAndSignReleaseTx,
} from '../../utils/contract'
import { isPaymentTooLate } from '../../utils/contract/status/isPaymentTooLate'
import i18n from '../../utils/i18n'
import {
  confirmContractCancelation,
  confirmPayment,
  extendPaymentTimer,
  getContract,
  getOfferDetails,
  rejectContractCancelation,
} from '../../utils/peachAPI'
import { getEscrowWalletForOffer } from '../../utils/wallet'
import { getNavigationDestinationForOffer } from '../yourTrades/utils'
import { EscrowButton } from './EscrowButton'
import { ReleaseEscrowSlider } from './ReleaseEscrowSlider'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { ProvideEmailButton } from './components/ProvideEmailButton'
import { useContractContext } from './context'
import { useRepublishOffer } from './hooks/useRepublishOffer'

export const ContractActions = () => {
  const { contract, view } = useContractContext()
  const requiredAction = getRequiredAction(contract)
  const { isEmailRequired, tradeStatus, disputeWinner, batchInfo, releaseTxId } = contract
  const shouldShowReleaseEscrow = tradeStatus === 'releaseEscrow' && !!disputeWinner
  return (
    <View style={tw`items-center justify-end w-full gap-3`}>
      <View style={tw`flex-row items-center justify-center gap-6`}>
        <EscrowButton {...contract} />
        <ChatButton />
      </View>

      {shouldShowPayoutPending(view, batchInfo, releaseTxId) && <PayoutPendingButton />}
      <ContractStatusInfo requiredAction={requiredAction} />
      {!!isEmailRequired && <ProvideEmailButton style={tw`self-center`} />}
      <NewOfferButton />
      {!shouldShowReleaseEscrow && <ContractCTA requiredAction={requiredAction} />}
      {shouldShowReleaseEscrow && <ReleaseEscrowSlider {...{ contract }} />}
    </View>
  )
}

type Props = {
  requiredAction: ContractAction
}
function ContractCTA ({ requiredAction }: Props) {
  const { contract, view } = useContractContext()

  if (view === 'buyer') {
    if (contract.tradeStatus === 'confirmCancelation') {
      return <ResolveCancelRequestSliders />
    }
    if (requiredAction === 'confirmPayment') {
      return <UnlockedSlider label={i18n('contract.payment.made')} />
    }
    if (requiredAction === 'sendPayment') {
      return <PaymentMadeSlider />
    }
  }
  if (view === 'seller') {
    if (isPaymentTooLate(contract) && contract.tradeStatus === 'paymentRequired') {
      return (
        <>
          <CancelTradeSlider />
          <ExtendTimerSlider />
        </>
      )
    }
    if (requiredAction === 'sendPayment') {
      return (
        <ConfirmSlider
          enabled={false}
          onConfirm={() => {}}
          label1={i18n('offer.requiredAction.waiting', i18n('buyer'))}
        />
      )
    }
    if (requiredAction === 'confirmPayment') return <PaymentReceivedSlider />

    if (contract.tradeStatus === 'refundOrReviveRequired') {
      return (
        <>
          <RepublishOfferSlider />
          <RefundEscrowSlider />
        </>
      )
    }
    if (contract.tradeStatus === 'refundTxSignatureRequired') {
      return <RefundEscrowSlider />
    }
  }

  return <></>
}

function RepublishOfferSlider () {
  const { contract } = useContractContext()
  const republishOffer = useRepublishOffer()
  return <ConfirmSlider onConfirm={() => republishOffer(contract)} label1={i18n('republishOffer')} iconId="refreshCw" />
}

function RefundEscrowSlider () {
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

function NewOfferButton () {
  const navigation = useNavigation()
  const { contract } = useContractContext()
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const newOfferId = offer?.newOfferId
  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return
    const [newOffer] = await getOfferDetails({ offerId: newOfferId })
    if (!newOffer) return
    if (newOffer?.contractId) {
      const [newContract] = await getContract({ contractId: newOffer.contractId })
      if (newContract === null) return
      const [screen, params] = await getNavigationDestinationForContract(newContract)
      navigation.replace(screen, params)
    } else {
      navigation.replace(...getNavigationDestinationForOffer(newOffer))
    }
  }, [newOfferId, navigation])

  return <>{!!newOfferId && <NewButton onPress={goToNewOffer}>{i18n('contract.goToNewTrade')}</NewButton>}</>
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

function ChatButton () {
  const {
    contract: { messages, id, disputeActive },
  } = useContractContext()
  const navigation = useNavigation()
  const showHelp = useShowHelp('disputeDisclaimer')
  const [seenDisputeDisclaimer, setSeenDisputeDisclaimer] = useConfigStore(
    (state) => [state.seenDisputeDisclaimer, state.setSeenDisputeDisclaimer],
    shallow,
  )
  const { contractId } = useRoute<'contract'>().params
  const queryClient = useQueryClient()
  const goToChat = () => {
    queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
      if (!oldQueryData) return oldQueryData
      return {
        ...oldQueryData,
        unreadMessages: 0,
      }
    })
    navigation.push('contractChat', { contractId: id })
    if (!seenDisputeDisclaimer) {
      showHelp()
      setSeenDisputeDisclaimer(true)
    }
  }
  return (
    <Button
      style={[tw`flex-1`, disputeActive && tw`bg-error-main`]}
      iconId={messages === 0 ? 'messageCircle' : 'messageFull'}
      onPress={goToChat}
    >
      {messages === 0 ? i18n('chat') : `${messages} ${i18n('contract.unread')}`}
    </Button>
  )
}

function PaymentMadeSlider () {
  const { contractId } = useRoute<'contract'>().params
  const { contract } = useContractContext()
  const showError = useShowErrorBanner()
  const queryClient = useQueryClient()
  const mutation = useMutation({
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
      enabled={!mutation.isLoading && !isPaymentTooLate(contract)}
      onConfirm={() => mutation.mutate()}
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
  const showError = useShowErrorBanner()
  const { contract } = useContractContext()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contract.id] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contract.id])
      queryClient.setQueryData(['contract', contract.id], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          canceled: true,
          tradeStatus: 'tradeCanceled' as const,
          lastModified: new Date(),
        }
      })
      return { previousData }
    },
    mutationFn: async () => {
      const result = await cancelContractAsSeller(contract)
      if (!result || result.isError()) throw result.getError()
    },
    onError: (err: string, _variables, context) => {
      queryClient.setQueryData(['contract', contract.id], context?.previousData)
      showError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contract.id])
    },
  })

  return (
    <ConfirmSlider
      enabled
      iconId="xCircle"
      onConfirm={() => mutate()}
      label1={i18n('contract.seller.paymentTimerHasRunOut.cancelTrade')}
    />
  )
}

function ExtendTimerSlider () {
  const { contractId } = useRoute<'contract'>().params
  const showError = useShowErrorBanner()

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contractId])
      queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          paymentExpectedBy: new Date(Date.now() + MSINANHOUR * 12),
          lastModified: new Date(),
        }
      })
      return { previousData }
    },
    mutationFn: async () => {
      const [result, err] = await extendPaymentTimer({ contractId })
      if (!result || err) throw err
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
      iconId="arrowRightCircle"
      enabled
      onConfirm={() => mutate()}
      label1={i18n('contract.seller.giveMoreTime')}
    />
  )
}

function ResolveCancelRequestSliders () {
  const { contractId } = useRoute<'contract'>().params
  const showError = useShowErrorBanner()
  const queryClient = useQueryClient()

  const { mutate: continueTrade } = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contractId])
      queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          cancelationRequested: false,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    mutationFn: async () => {
      const [, err] = await rejectContractCancelation({ contractId })
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

  const { mutate: cancelTrade } = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contractId])
      queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          canceled: true,
          cancelationRequested: false,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    mutationFn: async () => {
      const [, err] = await confirmContractCancelation({ contractId })
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
    <>
      <ConfirmSlider
        enabled
        onConfirm={() => cancelTrade()}
        label1={i18n('contract.cancelationRequested.agree')}
        iconId="xCircle"
      />
      <ConfirmSlider
        enabled
        onConfirm={() => continueTrade()}
        label1={i18n('contract.cancelationRequested.continueTrade')}
        iconId="arrowRightCircle"
      />
    </>
  )
}
