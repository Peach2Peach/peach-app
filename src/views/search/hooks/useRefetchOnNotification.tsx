import messaging from '@react-native-firebase/messaging'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

const updaterPNs = ['offer.matchSeller', 'contract.contractCreated']

export const useRefetchOnNotification = (refetch: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage((remoteMessage) => {
        if (!remoteMessage.data) return

        if (updaterPNs.includes(remoteMessage.data.type)) {
          refetch()
        }
      })

      return unsubscribe
    }, [refetch]),
  )
}
