import { useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'

import { useHeaderSetup, useRoute } from '../../../hooks'
import { useTradeSummaries } from '../../../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/system'
import { hasDoubleMatched, isOpenOffer, isPastOffer } from '../utils'

export const sortByDate = (a: TradeSummary, b: TradeSummary) => {
  if (a.paymentConfirmed && !b.paymentConfirmed) {
    return -1
  } else if (b.paymentConfirmed && !a.paymentConfirmed) {
    return 1
  } else if (a.paymentConfirmed && b.paymentConfirmed) {
    return b.paymentConfirmed.getTime() - a.paymentConfirmed.getTime()
  } else if (a.paymentMade && !b.paymentMade) {
    return -1
  } else if (b.paymentMade && !a.paymentMade) {
    return 1
  } else if (a.paymentMade && b.paymentMade) {
    return b.paymentMade.getTime() - a.paymentMade.getTime()
  }
  return b.creationDate.getTime() - a.creationDate.getTime()
}

export const useYourTradesSetup = () => {
  const route = useRoute<'yourTrades'>()
  const { tab = 'buy' } = route.params || {}
  const showErrorBanner = useShowErrorBanner()
  const [offers, setOffers, contracts, setContracts] = useTradeSummaryStore(
    (state) => [state.offers, state.setOffers, state.contracts, state.setContracts],
    shallow,
  )
  const { offers: offersUpdate, contracts: contractsUpdate, isLoading, error, refetch } = useTradeSummaries()

  const filteredOffers = offers.filter(({ tradeStatus }) => !hasDoubleMatched(tradeStatus))
  const trades = [...filteredOffers, ...contracts].sort(sortByDate).reverse()

  const allOpenOffers = trades.filter(({ tradeStatus }) => isOpenOffer(tradeStatus))
  const openOffers = {
    buy: allOpenOffers.filter(({ type }) => type === 'bid'),
    sell: allOpenOffers.filter(({ type }) => type === 'ask'),
  }

  const pastOffers = trades.filter(
    ({ tradeStatus, type }) => isPastOffer(tradeStatus) && (type === 'ask' || tradeStatus !== 'offerCanceled'),
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

  useEffect(() => {
    if (isLoading) return
    if (offersUpdate && contractsUpdate) {
      setOffers(offersUpdate)
      setContracts(contractsUpdate)
    }
    if (error) showErrorBanner(parseError(error))
  }, [isLoading, offersUpdate, contractsUpdate, error, showErrorBanner, setOffers, setContracts])

  return {
    isLoading,
    refetch,
    allOpenOffers,
    openOffers,
    pastOffers,
    tab,
  }
}
