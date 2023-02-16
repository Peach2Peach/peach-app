import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback } from 'react'
import { getContract } from '../../utils/contract'
import { info } from '../../utils/log'
import { getContract as getContractAPI } from '../../utils/peachAPI'
import { useContractPopupEvents } from './contract/useContractPopupEvents'

export const useContractMessageHandler = (currentContractId?: string) => {
  const contractPopupEvents = useContractPopupEvents(currentContractId)

  const onMessageHandler = useCallback(
    // eslint-disable-next-line max-statements
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<null | void> => {
      info('useHandleContractNotifications - A new FCM message arrived! ' + JSON.stringify(remoteMessage))
      if (!remoteMessage.data) return

      const data = remoteMessage.data as unknown as PNData
      const { contractId, type } = data
      if (!contractId || !type) return
      const storedContract = getContract(contractId)
      let [contract] = await getContractAPI({ contractId })
      if (contract && storedContract) contract = { ...contract, ...storedContract }

      if (!contract) return

      if (contractPopupEvents[type]) {
        contractPopupEvents[type]?.(contract, data)
      }
    },
    [contractPopupEvents],
  )

  return onMessageHandler
}
