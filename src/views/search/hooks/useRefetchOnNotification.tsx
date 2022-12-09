import messaging from '@react-native-firebase/messaging'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import MatchAccepted from '../../../overlays/MatchAccepted'
import { StackNavigation } from '../../../utils/navigation'

const updaterPNs = ['offer.matchSeller', 'contract.contractCreated']

export default (refetch: Function, offerId: string | undefined) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation<StackNavigation>()

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null | void> => {
        if (!remoteMessage.data) return

        if (updaterPNs.includes(remoteMessage.data.type)) {
          refetch()
        }

        if (remoteMessage.data.type === 'contract.contractCreated' && remoteMessage.data.offerId !== offerId) {
          updateOverlay({
            content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigation} />,
          })
        }
      })

      return unsubscribe
    }, [navigation, offerId, refetch, updateOverlay]),
  )
}
