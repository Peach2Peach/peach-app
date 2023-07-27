import { useCallback, useEffect, useState } from 'react'

import { useNavigation, useRoute } from '../../../hooks'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import {
  getNavigationDestinationForContract,
  getSellOfferFromContract,
  shouldRateCounterParty,
  verifyAndSignReleaseTx,
} from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { confirmPayment, getContract, getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../../yourTrades/utils'
import { useContractHeaderSetup } from './useContractHeaderSetup'
import { getEscrowWalletForOffer } from '../../../utils/wallet'
import { useIsFocused } from '@react-navigation/native'

// eslint-disable-next-line max-lines-per-function
export const useContractSetup = () => {
  const route = useRoute<'contract'>()
  const { contractId } = route.params
  const isFocused = useIsFocused()
  const { contract, saveAndUpdate, isLoading, view, requiredAction, newOfferId, refetch } =
    useCommonContractSetup(contractId)
  const navigation = useNavigation()
  const showError = useShowErrorBanner()

  const [actionPending, setActionPending] = useState(false)

  useContractHeaderSetup({
    contract,
    view,
    requiredAction,
    contractId,
  })

  useEffect(() => {
    if (!contract || !view || isLoading || !isFocused) return
    if (isTradeComplete(contract) && !contract.disputeWinner && !contract.canceled) {
      if (shouldRateCounterParty(contract, view)) {
        refetch().then(({ data }) => {
          if (data && shouldRateCounterParty(data, view)) navigation.replace('tradeComplete', { contract: data })
        })
      }
    }
  }, [contract, isFocused, isLoading, navigation, refetch, view])

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

    const sellOffer = getSellOfferFromContract(contract)
    const [tx, errorMsg, batchMode] = verifyAndSignReleaseTx(contract, sellOffer, getEscrowWalletForOffer(sellOffer))

    if (!tx) {
      setActionPending(false)
      showError(errorMsg)
      return
    }

    const [result, err] = await confirmPayment({
      contractId: contract.id,
      releaseTransaction: !batchMode ? tx : undefined,
      batchReleasePsbt: batchMode ? tx : undefined,
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
  }, [contractId, contract, saveAndUpdate, showError])

  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return
    const [newOffer] = await getOfferDetails({ offerId: newOfferId })
    if (newOffer?.contractId) {
      const [newContract] = await getContract({ contractId: newOffer.contractId })
      if (newContract === null) return
      const [screen, params] = await getNavigationDestinationForContract(newContract)
      navigation.replace(screen, params)
    } else {
      navigation.replace(...getNavigationDestinationForOffer(newOffer))
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
