import analytics from '@react-native-firebase/analytics'
import { useCallback } from 'react'
import { useAppStateEffect } from './effects/useAppStateEffect'
import { useCheckTradeNotifications } from './hooks/useCheckTradeNotifications'
import { getPeachInfo } from './init/getPeachInfo'

export const usePartialAppSetup = () => {
  useCheckTradeNotifications()

  const appStateCallback = useCallback((isActive: boolean) => {
    if (isActive) {
      getPeachInfo()
      analytics().logAppOpen()
    }
  }, [])

  useAppStateEffect(appStateCallback)
}
