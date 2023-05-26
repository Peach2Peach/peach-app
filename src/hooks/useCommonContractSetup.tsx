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
  getPaymentExpectedBy,
  getRequiredAction,
  saveContract,
} from '../utils/contract'
import { saveOffer } from '../utils/offer'
import { PeachWSContext } from '../utils/peachAPI/websocket'
import { useHandleNotifications } from './notifications/useHandleNotifications'
import { useContractDetails } from './query/useContractDetails'
import { useOfferDetails } from './query/useOfferDetails'
import { useShowErrorBanner } from './useShowErrorBanner'

export const useCommonContractSetup = (contractId: string) => {
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const handleContractOverlays = useHandleContractOverlays()
  const { contract, isLoading, refetch } = useContractDetails(contractId, 15 * 1000)
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const [storedContract, setStoredContract] = useState(getContract(contractId))
  const view = contract ? getContractViewer(contract, account) : undefined
  const requiredAction = storedContract ? getRequiredAction(storedContract) : 'none'
  const [decryptionError, setDecryptionError] = useState(false)

  const saveAndUpdate = useCallback((contractData: Partial<Contract>) => {
    setStoredContract((prev) => {
      const updatedContract = prev ? { ...prev, ...contractData } : (contractData as Contract)
      if (updatedContract.id) saveContract(updatedContract)
      return updatedContract
    })
  }, [])

  useHandleNotifications(
    useCallback(
      (message) => {
        if (message.data?.contractId === contractId) refetch()
      },
      [contractId, refetch],
    ),
  )

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
        if (!message.message || message.roomId !== `contract-${contractId}` || message.from === account.publicKey) return

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
        saveAndUpdate({ ...contract, error: 'DECRYPTION_ERROR' })

        return setDecryptionError(true)
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
    if (!contract) return () => {}
    const whenToFetch = getPaymentExpectedBy(contract) - Date.now()
    if (whenToFetch <= 0) return () => {}
    const timeout = setTimeout(refetch, whenToFetch)

    return () => {
      clearTimeout(timeout)
    }
  }, [contract, refetch])

  useEffect(() => {
    if (!storedContract) return
    handleContractOverlays(storedContract, getContractViewer(storedContract, account))
  }, [storedContract, handleContractOverlays])

  useEffect(() => {
    if (offer) saveOffer(offer)
  }, [offer])

  return {
    contract: storedContract || contract,
    newOfferId: offer?.newOfferId,
    saveAndUpdate,
    isLoading,
    view,
    requiredAction,
    refetch,
  }
}
