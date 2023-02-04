import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { CancelIcon, HelpIcon } from '../../../components/icons'
import ContractTitle from '../../../components/titles/ContractTitle'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useConfirmCancelTrade } from '../../../overlays/tradeCancelation/useConfirmCancelTrade'
import { canCancelContract, getOfferIdFromContract, signReleaseTx } from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { confirmPayment } from '../../../utils/peachAPI'

// eslint-disable-next-line max-statements
export const useContractSetup = () => {
  const route = useRoute<'contract'>()
  const { contractId } = route.params

  const { contract, saveAndUpdate, isLoading, view, requiredAction } = useCommonContractSetup(contractId)
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const { showConfirmOverlay } = useConfirmCancelTrade()
  const showMakePaymentHelp = useShowHelp('makePayment')
  const showConfirmPaymentHelp = useShowHelp('confirmPayment')

  const [actionPending, setActionPending] = useState(false)

  useHeaderSetup(
    useMemo(() => {
      const icons = []
      if (contract && canCancelContract(contract)) icons.push({
        iconComponent: <CancelIcon />,
        onPress: () => showConfirmOverlay(contract),
      })
      if (view === 'buyer' && requiredAction === 'sendPayment') icons.push({
        iconComponent: <HelpIcon />,
        onPress: showMakePaymentHelp,
      })
      if (view === 'seller' && requiredAction === 'confirmPayment') icons.push({
        iconComponent: <HelpIcon />,
        onPress: showConfirmPaymentHelp,
      })
      return {
        titleComponent: <ContractTitle id={contractId} amount={contract?.amount} />,
        icons,
      }
    }, [showConfirmOverlay, contract, requiredAction, contractId, showConfirmPaymentHelp, showMakePaymentHelp, view]),
  )

  useEffect(() => {
    if (!contract || !view || isLoading) return

    if (isTradeComplete(contract)) {
      if (
        (!contract.disputeWinner && view === 'buyer' && !contract.ratingSeller && !contract.canceled)
        || (view === 'seller' && !contract.ratingBuyer)
      ) {
        navigation.replace('tradeComplete', { contract })
        return
      }
      // questionable if this is the right place to go

      navigation.replace('offer', { offerId: getOfferIdFromContract(contract) })
    }
  }, [contract, isLoading, navigation, view])

  const postConfirmPaymentBuyer = useCallback(async () => {
    if (!contract) return

    const [, err] = await confirmPayment({ contractId })

    if (err) {
      showError(err.error)

      return
    }

    saveAndUpdate({
      ...contract,
      paymentMade: new Date(),
    })
  }, [contractId, saveAndUpdate, showError, contract])

  const postConfirmPaymentSeller = useCallback(async () => {
    if (!contract) return
    setActionPending(true)

    const [tx, errorMsg] = signReleaseTx(contract)

    if (!tx) {
      setActionPending(false)
      showError(errorMsg)
      return
    }

    const [result, err] = await confirmPayment({ contractId, releaseTransaction: tx })

    setActionPending(false)

    if (err) {
      showError(err.error)
      return
    }

    saveAndUpdate({
      ...contract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
    })
  }, [contractId, saveAndUpdate, showError, contract])

  return {
    contract,
    isLoading,
    view,
    requiredAction,
    actionPending,
    postConfirmPaymentBuyer,
    postConfirmPaymentSeller,
  }
}
