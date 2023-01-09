import { useCallback, useMemo, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { getContracts, getOffers } from '../../utils/peachAPI'
import { hasDoubleMatched, isContractSummary } from './utils'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'
import shallow from 'zustand/shallow'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'

const sortByDate = (a: TradeSummary, b: TradeSummary) => {
  if (!a.paymentMade?.getTime()) return a.creationDate.getTime() > b.creationDate.getTime() ? 1 : -1
  if (!b.paymentMade?.getTime()) return a.paymentMade.getTime() > b.creationDate.getTime() ? 1 : -1
  return a.paymentMade.getTime() > b.paymentMade.getTime() ? 1 : -1
}
export const useYourTradesSetup = () => {
  const showErrorBanner = useShowErrorBanner()
  const [offers, setOffers, contracts, setContracts] = useTradeSummaryStore(
    (state) => [state.offers, state.setOffers, state.contracts, state.setContracts],
    shallow,
  )

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('yourTrades.title'),
        hideGoBackButton: true,
      }),
      [],
    ),
  )

  const getTradeSummary = useCallback(async () => {
    const [getOffersResult, getOffersErr] = await getOffers({})
    const [getContractsResult, getContractsErr] = await getContracts({})
    if (getOffersResult && getContractsResult) {
      setOffers(getOffersResult.filter((offer) => !hasDoubleMatched(offer.tradeStatus)))
      setContracts(getContractsResult)
    }
    if (getOffersErr || getContractsErr) {
      showErrorBanner((getOffersErr || getContractsErr)!.error)
    }
  }, [setContracts, setOffers, showErrorBanner])

  useFocusEffect(
    useCallback(() => {
      getTradeSummary()
    }, [getTradeSummary]),
  )

  return {
    trades: [...offers, ...contracts].sort(sortByDate).reverse(),
    getTradeSummary,
  }
}
