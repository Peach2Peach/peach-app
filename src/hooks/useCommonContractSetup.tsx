import { useCallback, useContext, useEffect, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import AppContext from '../contexts/app'
import { OverlayContext } from '../contexts/overlay'
import { handleOverlays } from '../overlays/handleOverlays'
import { account } from '../utils/account'
import { getChatNotifications } from '../utils/chat'
import {
  decryptContractData,
  getContract,
  getContractViewer,
  getOfferIdFromContract,
  getRequiredAction,
  saveContract,
} from '../utils/contract'
import { getRequiredActionCount, saveOffer } from '../utils/offer'
import { PeachWSContext } from '../utils/peachAPI/websocket'
import { useContractDetails } from './useContractDetails'
import { useOfferDetails } from './useOfferDetails'
import { useShowErrorBanner } from './useShowErrorBanner'

export const useCommonContractSetup = (contractId: string) => {
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateAppContext] = useContext(AppContext)
  const showError = useShowErrorBanner()

  const { contract, isLoading } = useContractDetails(contractId)
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const [storedContract, setStoredContract] = useState(getContract(contractId))
  const view = contract ? getContractViewer(contract, account) : undefined
  const requiredAction = contract ? getRequiredAction(contract) : 'none'
  const [decryptionError, setDecryptionError] = useState(false)

  const saveAndUpdate = useCallback(
    (contractData: Contract): Contract => {
      setStoredContract(contractData)
      saveContract(contractData)
      updateAppContext({
        notifications: getChatNotifications() + getRequiredActionCount(),
      })

      return contractData
    },
    [updateAppContext],
  )

  useFocusEffect(
    useCallback(() => {
      const contractUpdateHandler = async (update: ContractUpdate) => {
        if (!storedContract || update.contractId !== contractId || !update.event) return
        saveAndUpdate({
          ...storedContract,
          [update.event]: new Date(update.data.date),
        })
      }
      const messageHandler = async (message: Message) => {
        if (!storedContract) return
        if (!message.message || message.roomId !== `contract-${contractId}`) return

        saveAndUpdate({
          ...storedContract,
          unreadMessages: storedContract.unreadMessages + 1,
        })
      }
      const unsubscribe = () => {
        ws.off('message', contractUpdateHandler)
        ws.off('message', messageHandler)
      }

      if (!ws.connected) return unsubscribe

      ws.on('message', contractUpdateHandler)
      ws.on('message', messageHandler)

      return unsubscribe
    }, [contractId, saveAndUpdate, storedContract, ws]),
  )

  useEffect(() => {
    if (!contract || (storedContract?.symmetricKey && storedContract?.paymentData)) return
    if (decryptionError) return
    ;(async () => {
      const { symmetricKey, paymentData } = await decryptContractData(contract)
      if (!symmetricKey || !paymentData) {
        setDecryptionError(true)
        return showError()
      }

      const updatedContract = {
        ...contract,
        symmetricKey,
        paymentData,
      }
      return saveAndUpdate(updatedContract)
    })()
  }, [contract, decryptionError, saveAndUpdate, showError, storedContract, updateOverlay])

  useEffect(() => {
    if (!contract) return
    handleOverlays({ contract, updateOverlay, view: getContractViewer(contract, account) })
  }, [contract, updateOverlay])

  useEffect(() => {
    if (offer) saveOffer(offer, false)
  }, [offer])

  return {
    contract: storedContract || contract,
    saveAndUpdate,
    isLoading,
    view,
    requiredAction,
  }
}
