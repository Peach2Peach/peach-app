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
import { getContracts, getOffers, getTradingLimit } from '../utils/peachAPI'
import shallow from 'zustand/shallow'

export const useAppSetup = (navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>) => {
  const [, updateMessage] = useContext(MessageContext)

  const { publicKey, setTradingLimit, setOffer, setContract } = useUserDataStore(
    (state) => ({
      publicKey: state.publicKey,
      setTradingLimit: state.setTradingLimit,
      setOffer: state.setOffer,
      setContract: state.setContract,
    }),
    shallow,
  )
  const userDataStore = useUserDataStore()

  useEffect(() => {
    ;(async () => {
      info('useAppSetup - start')

      if (publicKey) {
        const [tradingLimit] = await getTradingLimit({ timeout: 10000 })
        if (tradingLimit) setTradingLimit(tradingLimit)

        const [offers] = await getOffers({})
        if (offers) offers.forEach(setOffer)

        const [contracts] = await getContracts({})
        if (contracts) contracts.forEach(setContract)

        userUpdate(userDataStore)
      }

      initialNavigation(userDataStore.publicKey, navigationRef, updateMessage)
      info('useAppSetup - done')
    })()
  }, [publicKey, setOffer, setContract, navigationRef, updateMessage])

  useEffect(() => {
    events()
    ;(async () => {
      await getPeachInfo(userDataStore)
      await requestUserPermissions()
    })()
  }, [])
}
