import analytics from '@react-native-firebase/analytics'
import { useCallback } from 'react'
import RNRestart from 'react-native-restart'
import { useAppStateEffect } from './effects/useAppStateEffect'
import { useCheckTradeNotifications } from './hooks/useCheckTradeNotifications'
import { getPeachInfo } from './init/getPeachInfo'
import { getTrades } from './init/getTrades'
import { TIMETORESTART } from './constants'
import { account } from './utils/account'

let goHomeTimeout: NodeJS.Timer

export const usePartialAppSetup = () => {
  useCheckTradeNotifications()

  const appStateCallback = useCallback((isActive: boolean) => {
    if (isActive) {
      getPeachInfo()
      if (account?.publicKey) getTrades()
      analytics().logAppOpen()

      clearTimeout(goHomeTimeout)
    } else {
      goHomeTimeout = setTimeout(() => RNRestart.Restart(), TIMETORESTART)
    }
  }, [])

  useAppStateEffect(appStateCallback)
}
