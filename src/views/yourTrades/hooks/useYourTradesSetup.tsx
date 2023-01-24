import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'
import shallow from 'zustand/shallow'

import { useHeaderSetup } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import i18n from '../../../utils/i18n'
import { getContractSummaries, getOfferSummaries } from '../../../utils/peachAPI'
import { hasDoubleMatched, isOpenOffer, isPastOffer } from '../utils'

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

  const trades = [...offers, ...contracts].sort(sortByDate).reverse()

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
    getTradeSummary,
    allOpenOffers,
    openOffers,
    pastOffers,
  }
}
