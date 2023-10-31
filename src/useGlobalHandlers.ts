import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useMarketPrices, useShouldShowBackupReminder, useUpdateTradingAmounts } from './hooks'
import { useHandleNotifications } from './hooks/notifications/useHandleNotifications'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useCheckFundingMultipleEscrows } from './hooks/useCheckFundingMultipleEscrows'
import { useDynamicLinks } from './hooks/useDynamicLinks'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'
import { useInitialNavigation } from './init/useInitialNavigation'
import { useShowAnalyticsPopup } from './popups/useShowAnalyticsPopup'
import { useBitcoinStore } from './store/bitcoinStore'
import { useSettingsStore } from './store/settingsStore'

export const useGlobalHandlers = () => {
  const messageHandler = useMessageHandler()
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
  useCheckFundingMultipleEscrows()
  useHandleNotifications(messageHandler)

  useEffect(() => {
    if (!useSettingsStore.persist?.hasHydrated()) return
    if (!analyticsPopupSeen) showAnalyticsPrompt()
  }, [analyticsPopupSeen, showAnalyticsPrompt])

  useEffect(() => {
    setCurrency(displayCurrency)

    if (!prices) return
    setPrices(prices)
    if (prices.CHF) updateTradingAmounts(prices.CHF)
  }, [displayCurrency, prices, setCurrency, setPrices, updateTradingAmounts])
}
