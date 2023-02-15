import messaging from '@react-native-firebase/messaging'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

const updaterPNs = ['offer.matchSeller', 'contract.contractCreated']

export default (refetch: Function, offerId: string | undefined) => {
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null | void> => {
        if (!remoteMessage.data) return

        if (updaterPNs.includes(remoteMessage.data.type)) {
          refetch()
        }
      })

      return unsubscribe
    }, [refetch]),
  )
}
