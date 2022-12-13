import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { useContext, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { MessageContext } from '../contexts/message'
import { useUserDataStore } from '../store'
import { info } from '../utils/log'
import { getContracts, getOffers, getTradingLimit } from '../utils/peachAPI'
import events from './events'
import { initialNavigation } from './initialNavigation'
import requestUserPermissions from './requestUserPermissions'
import { getPeachInfo } from './session'
import userUpdate from './userUpdate'

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
