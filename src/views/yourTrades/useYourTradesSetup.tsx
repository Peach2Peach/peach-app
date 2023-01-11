import { useCallback, useMemo } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import shallow from 'zustand/shallow'
import { useHeaderSetup } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import i18n from '../../utils/i18n'
import { getContractSummaries, getOfferSummaries } from '../../utils/peachAPI'
import { hasDoubleMatched, isContractSummary } from './utils'

const sortByDate = (a: TradeSummary, b: TradeSummary) => {
  if (isContractSummary(a) && isContractSummary(b)) {
    return a.paymentMade?.getTime() > b.paymentMade?.getTime() ? 1 : -1
  }
  return a.creationDate.getTime() > b.creationDate.getTime() ? 1 : -1
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
    const [getOffersResult, getOffersErr] = await getOfferSummaries({})
    const [getContractsResult, getContractsErr] = await getContractSummaries({})
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
