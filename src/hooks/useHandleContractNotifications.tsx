import messaging from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { error, info } from '../utils/log'
import { parseError } from '../utils/system'
import { useContractMessageHandler } from './useContractMessageHandler'

export const useHandleContractNotifications = (currentContractId?: string) => {
  const contractMessageHandler = useContractMessageHandler(currentContractId)

  useEffect(() => {
    info('useHandleContractNotifications - Subscribe to push notifications')
    try {
      const unsubscribe = messaging().onMessage(contractMessageHandler)

      return unsubscribe
    } catch (e) {
      error('useHandleContractNotifications - messaging().onMessage - Push notifications not supported', parseError(e))
      return () => {}
    }
  }, [contractMessageHandler])
}
