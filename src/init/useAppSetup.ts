import { useContext, useEffect } from 'react'
import { initialNavigation } from './initialNavigation'
import { MessageContext } from '../contexts/message'
import { info } from '../utils/log'
import events from './events'
import requestUserPermissions from './requestUserPermissions'
import { getPeachInfo, getTrades } from './session'
import userUpdate from './userUpdate'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { useUserDataStore } from '../store'
import { getTradingLimit } from '../utils/peachAPI'

export const useAppSetup = (navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>) => {
  const [, updateMessage] = useContext(MessageContext)

  const publicKey = useUserDataStore((state) => state.publicKey)
  const userDataStore = useUserDataStore()

  useEffect(() => {
    ;(async () => {
      info('useAppSetup - start')

      if (publicKey) {
        const [tradingLimit] = await getTradingLimit({ timeout: 10000 })
        if (tradingLimit) userDataStore.setTradingLimit(tradingLimit)

        getTrades()
        userUpdate(userDataStore)
      }

      initialNavigation(userDataStore.publicKey, navigationRef, updateMessage)
      info('useAppSetup - done')
    })()
  }, [publicKey, navigationRef, updateMessage])

  useEffect(() => {
    events()
    ;(async () => {
      await getPeachInfo(userDataStore)
      await requestUserPermissions()
    })()
  }, [])
}
