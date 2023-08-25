import { useEffect, useMemo, useState } from 'react'
import { TabbedNavigationItem } from '../../../components/navigation/TabbedNavigation'
import { useRoute } from '../../../hooks'
import { useTradeSummaries } from '../../../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { sortContractsByDate } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { parseError } from '../../../utils/result'
import { isOpenOffer, isPastOffer } from '../utils'
import { getTabById } from '../utils/getTabById'

export const useYourTradesSetup = () => {
  const tabs: TabbedNavigationItem[] = useMemo(
    () => [
      { id: 'buy', display: i18n('yourTrades.buy') },
      { id: 'sell', display: i18n('yourTrades.sell') },
      { id: 'history', display: i18n('yourTrades.history') },
    ],
    [],
  )
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
    (item) =>
      isPastOffer(item.tradeStatus)
      && ((item.type === 'ask' && 'fundingTxId' in item && !!item?.fundingTxId) || item.tradeStatus !== 'offerCanceled'),
  )

  useEffect(() => {
    if (tab) setCurrentTab(getTabById(tabs, tab) || tabs[0])
  }, [tab, tabs])

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
