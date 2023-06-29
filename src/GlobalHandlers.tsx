import { shallow } from 'zustand/shallow'
import { useMarketPrices, useUpdateTradingAmounts } from './hooks'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useBitcoinStore } from './store/bitcoinStore'
import { useSettingsStore } from './store/useSettingsStore'
import { useInitialNavigation } from './init/useInitialNavigation'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'
import { useEffect } from 'react'
import { useHandleNotifications } from './hooks/notifications/useHandleNotifications'
import { useShowAnalyticsPopup } from './popups/useShowAnalyticsPopup'
import { MSINAMONTH } from './constants'

type Props = {
  getCurrentPage: () => keyof RootStackParamList | undefined
}
export const GlobalHandlers = ({ getCurrentPage }: Props) => {
  const messageHandler = useMessageHandler(getCurrentPage)
  const showAnalyticsPrompt = useShowAnalyticsPopup()
  const [analyticsPopupSeen, lastBackupDate, showBackupReminder, setShowBackupReminder] = useSettingsStore(
    (state) => [state.analyticsPopupSeen, state.lastBackupDate, state.showBackupReminder, state.setShowBackupReminder],
    shallow,
  )
  const updateTradingAmounts = useUpdateTradingAmounts()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)
  const [setPrices, setCurrency] = useBitcoinStore((state) => [state.setPrices, state.setCurrency], shallow)
  const { data: prices } = useMarketPrices()
  if (!showBackupReminder && lastBackupDate && Date.now() - lastBackupDate > MSINAMONTH) {
    setShowBackupReminder(true)
  }

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
