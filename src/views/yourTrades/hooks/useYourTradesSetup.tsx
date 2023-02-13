import { useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'

import { useHeaderSetup, useRoute } from '../../../hooks'
import { useTradeSummaries } from '../../../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { sortContractsByDate } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/system'
import { hasDoubleMatched, isOpenOffer, isPastOffer } from '../utils'

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
  const trades = [...filteredOffers, ...contracts].sort(sortContractsByDate).reverse()

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
