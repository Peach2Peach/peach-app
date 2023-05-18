import { useEffect, useMemo, useState } from 'react'
import { TabbedNavigationItem } from '../../../components/navigation/TabbedNavigation'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useTradeSummaries } from '../../../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { sortContractsByDate } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/result'
import { isOpenOffer, isPastOffer } from '../utils'
import { getTabById } from '../utils/getTabById'

export const useYourTradesSetup = () => {
  const tabs: TabbedNavigationItem[] = [
    { id: 'buy', display: i18n('yourTrades.buy') },
    { id: 'sell', display: i18n('yourTrades.sell') },
    { id: 'history', display: i18n('yourTrades.history') },
  ]
  const route = useRoute<'yourTrades'>()
  const { tab = 'buy' } = route.params || {}
  const showErrorBanner = useShowErrorBanner()
  const [currentTab, setCurrentTab] = useState(getTabById(tabs, tab) || tabs[0])

  const { offers, contracts, isFetching, isLoading, error, refetch } = useTradeSummaries()

  const filteredOffers = offers.filter(({ contractId }) => !contractId)
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
    if (tab) setCurrentTab(getTabById(tabs, tab) || tabs[0])
  }, [tab])

  useEffect(() => {
    if (isFetching) return

    if (error) showErrorBanner(parseError(error))
  }, [isFetching, error, showErrorBanner])

  return {
    isLoading,
    refetch,
    allOpenOffers,
    openOffers,
    pastOffers,
    tabs,
    currentTab,
    setCurrentTab,
  }
}
