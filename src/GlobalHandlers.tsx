import { shallow } from 'zustand/shallow'
import { useMarketPrices, useUpdateTradingAmounts, useShouldShowBackupReminder } from './hooks'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useBitcoinStore } from './store/bitcoinStore'
import { useSettingsStore } from './store/settingsStore'
import { useInitialNavigation } from './init/useInitialNavigation'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'
import { useEffect } from 'react'
import { useHandleNotifications } from './hooks/notifications/useHandleNotifications'
import { useShowAnalyticsPopup } from './popups/useShowAnalyticsPopup'

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
