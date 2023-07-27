import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useMarketPrices, useShouldShowBackupReminder, useUpdateTradingAmounts } from './hooks'
import { useHandleNotifications } from './hooks/notifications/useHandleNotifications'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'
import { useInitialNavigation } from './init/useInitialNavigation'
import { useShowAnalyticsPopup } from './popups/useShowAnalyticsPopup'
import { useBitcoinStore } from './store/bitcoinStore'
import { useSettingsStore } from './store/settingsStore'
import { useDynamicLinks } from './hooks/useDynamicLinks'

type Props = {
  currentPage: keyof RootStackParamList | undefined
}

export const GlobalHandlers = ({ currentPage }: Props) => {
  const messageHandler = useMessageHandler(currentPage)
  const showAnalyticsPrompt = useShowAnalyticsPopup()
  const analyticsPopupSeen = useSettingsStore((state) => state.analyticsPopupSeen)
  const updateTradingAmounts = useUpdateTradingAmounts()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)
  const [setPrices, setCurrency] = useBitcoinStore((state) => [state.setPrices, state.setCurrency], shallow)
  const { data: prices } = useMarketPrices()

  useShouldShowBackupReminder()
  useInitialNavigation()
  useShowUpdateAvailable()
  useDynamicLinks()

  useEffect(() => {
    if (!useSettingsStore.persist?.hasHydrated()) return
    if (!analyticsPopupSeen) showAnalyticsPrompt()
  }, [analyticsPopupSeen, showAnalyticsPrompt])

  useHandleNotifications(messageHandler)

  useEffect(() => {
    setCurrency(displayCurrency)

    if (!prices) return
    setPrices(prices)
    if (prices.CHF) updateTradingAmounts(prices.CHF)
  }, [displayCurrency, prices, setCurrency, setPrices, updateTradingAmounts])

  return <></>
}
