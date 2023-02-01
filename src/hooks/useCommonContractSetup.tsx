import { useCallback, useContext, useEffect, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { OverlayContext } from '../contexts/overlay'
import { useHandleContractOverlays } from '../overlays/useHandleContractOverlays'
import { account } from '../utils/account'
import {
  decryptContractData,
  getContract,
  getContractViewer,
  getOfferIdFromContract,
  getRequiredAction,
  saveContract,
} from '../utils/contract'
import { saveOffer } from '../utils/offer'
import { PeachWSContext } from '../utils/peachAPI/websocket'
import { useContractDetails } from './query/useContractDetails'
import { useOfferDetails } from './query/useOfferDetails'
import { useShowErrorBanner } from './useShowErrorBanner'
import { useCheckTradeNotifications } from './useCheckTradeNotifications'

export const useCommonContractSetup = (contractId: string) => {
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const handleContractOverlays = useHandleContractOverlays()

  const { contract, isLoading } = useContractDetails(contractId, 15 * 1000)
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const [storedContract, setStoredContract] = useState(getContract(contractId))
  const view = contract ? getContractViewer(contract, account) : undefined
  const requiredAction = contract ? getRequiredAction(contract) : 'none'
  const [decryptionError, setDecryptionError] = useState(false)
  const checkTradeNotifications = useCheckTradeNotifications()

  const saveAndUpdate = useCallback((contractData: Partial<Contract>) => {
    setStoredContract((prev) => {
      const updatedContract = prev ? { ...prev, ...contractData } : contractData
      if (updatedContract.id) saveContract(updatedContract as Contract)
      return updatedContract as Contract
    })
    checkTradeNotifications()
  }, [])

  useFocusEffect(
    useCallback(() => {
      const contractUpdateHandler = async (update: ContractUpdate) => {
        if (!storedContract || update.contractId !== contractId || !update.event) return
        saveAndUpdate({
          [update.event]: new Date(update.data.date),
        })
      }
      const messageHandler = async (message: Message) => {
        if (!storedContract) return
        if (!message.message || message.roomId !== `contract-${contractId}`) return

        saveAndUpdate({
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
  useFocusEffect(
    useCallback(() => {
      setStoredContract(getContract(contractId))
    }, [contractId]),
  )

  useEffect(() => {
    if (!contract) return
    if (storedContract?.symmetricKey && storedContract?.paymentData) {
      saveAndUpdate(contract)
      return
    }
    if (decryptionError) return
    ;(async () => {
      const { symmetricKey, paymentData } = await decryptContractData(contract)
      if (!symmetricKey || !paymentData) {
        setDecryptionError(true)
        return showError()
      }

      return saveAndUpdate({ ...contract, symmetricKey, paymentData })
    })()
  }, [
    contract,
    decryptionError,
    saveAndUpdate,
    showError,
    storedContract?.paymentData,
    storedContract?.symmetricKey,
    updateOverlay,
  ])

  useEffect(() => {
    if (!storedContract) return
    handleContractOverlays(storedContract, getContractViewer(storedContract, account))
  }, [storedContract, handleContractOverlays])

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
