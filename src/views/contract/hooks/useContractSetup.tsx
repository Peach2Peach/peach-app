import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { CancelIcon, HelpIcon } from '../../../components/icons'
import ContractTitle from '../../../components/titles/ContractTitle'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useConfirmCancelTrade } from '../../../overlays/tradeCancelation/useConfirmCancelTrade'
import { canCancelContract, signReleaseTx } from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { confirmPayment, getContract, getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForContract, getNavigationDestinationForOffer } from '../../yourTrades/utils'

export const useContractSetup = () => {
  const route = useRoute<'contract'>()
  const { contractId } = route.params

  const { contract, saveAndUpdate, isLoading, view, requiredAction, newOfferId } = useCommonContractSetup(contractId)
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
        titleComponent: <ContractTitle id={contractId} />,
        icons,
      }
    }, [showConfirmOverlay, contract, requiredAction, contractId, showConfirmPaymentHelp, showMakePaymentHelp, view]),
  )

  useEffect(() => {
    if (!contract || !view || isLoading) return

    if (isTradeComplete(contract) && !contract.disputeWinner && !contract.canceled) {
      if ((view === 'buyer' && !contract.ratingSeller) || (view === 'seller' && !contract.ratingBuyer)) {
        navigation.replace('tradeComplete', { contract })
      }
    }
  }, [contract, isLoading, navigation, view])

  const postConfirmPaymentBuyer = useCallback(async () => {
    const [, err] = await confirmPayment({ contractId })

    if (err) {
      showError(err.error)

      return
    }

    saveAndUpdate({
      paymentMade: new Date(),
    })
  }, [contractId, saveAndUpdate, showError])

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
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
    })
  }, [contractId, contract, saveAndUpdate, showError])

  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return
    const newOffer = await getOfferDetails({ offerId: newOfferId })
    if (newOffer[0]?.contractId) {
      const newContract = await getContract({ contractId: newOffer[0].contractId })
      navigation.replace(...getNavigationDestinationForContract(newContract[0]))
    } else {
      navigation.replace(...getNavigationDestinationForOffer(newOffer[0]))
    }
  }, [newOfferId, navigation])

  return {
    contract,
    isLoading,
    view,
    requiredAction,
    actionPending,
    hasNewOffer: !!newOfferId,
    postConfirmPaymentBuyer,
    postConfirmPaymentSeller,
    goToNewOffer,
  }
}
