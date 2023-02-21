import messaging from '@react-native-firebase/messaging'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import MatchAccepted from '../../../overlays/MatchAccepted'

const updaterPNs = ['offer.matchSeller', 'contract.contractCreated']

export default (refetch: Function, offerId: string | undefined) => {
  const [, updateOverlay] = useContext(OverlayContext)

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null | void> => {
        if (!remoteMessage.data) return

        if (updaterPNs.includes(remoteMessage.data.type)) {
          refetch()
        }

        if (remoteMessage.data.type === 'contract.contractCreated' && remoteMessage.data?.offerId !== offerId) {
          updateOverlay({
            content: <MatchAccepted contractId={remoteMessage.data.contractId} />,
          })
        }
      })

      return unsubscribe
    }, [offerId, refetch, updateOverlay]),
  )
}
