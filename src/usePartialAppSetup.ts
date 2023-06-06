import analytics from '@react-native-firebase/analytics'
import { useCallback } from 'react'
import RNRestart from 'react-native-restart'
import { useAppStateEffect } from './effects/useAppStateEffect'
import { useCheckTradeNotifications } from './hooks/useCheckTradeNotifications'
import { getPeachInfo } from './init/getPeachInfo'
import { getTrades } from './init/getTrades'
import { useAccountStore } from './store/accountStore'
import { TIMETORESTART } from './constants'

let goHomeTimeout: NodeJS.Timer

export const usePartialAppSetup = () => {
  const account = useAccountStore((state) => state)
  useCheckTradeNotifications()

  const appStateCallback = useCallback(
    (isActive: boolean) => {
      if (isActive) {
        getPeachInfo()
        if (account.loggedIn) getTrades()
        analytics().logAppOpen()

        clearTimeout(goHomeTimeout)
      } else {
        goHomeTimeout = setTimeout(() => RNRestart.Restart(), TIMETORESTART)
      }
    },
    [account.loggedIn],
  )

  useAppStateEffect(appStateCallback)
}
