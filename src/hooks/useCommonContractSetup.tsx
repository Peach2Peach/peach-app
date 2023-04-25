import { useCallback, useContext, useEffect, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { OverlayContext } from '../contexts/overlay'
import { useHandleContractOverlays } from '../overlays/useHandleContractOverlays'
import { account } from '../utils/account'
import {
  decryptContractData,
  getContractViewer,
  getOfferIdFromContract,
  getPaymentExpectedBy,
  getRequiredAction,
} from '../utils/contract'
import { saveOffer } from '../utils/offer'
import { PeachWSContext } from '../utils/peachAPI/websocket'
import { useHandleNotifications as useHandlePushNotifications } from './notifications/usePushHandleNotifications'
import { useContractDetails } from './query/useContractDetails'
import { useOfferDetails } from './query/useOfferDetails'
import { useShowErrorBanner } from './useShowErrorBanner'
import { useContractStore } from '../store/contractStore'
import { shallow } from 'zustand/shallow'

export const useCommonContractSetup = (contractId: string) => {
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const handleContractOverlays = useHandleContractOverlays()
  const { contract, isLoading, refetch } = useContractDetails(contractId, 15 * 1000)
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const storedContract = useContractStore((state) => state.contracts[contractId])
  const [setContract, updateContract] = useContractStore((state) => [state.setContract, state.updateContract], shallow)
  const view = contract ? getContractViewer(contract, account) : undefined
  const requiredAction = contract ? getRequiredAction(contract) : 'none'
  const [decryptionError, setDecryptionError] = useState(false)

  const saveAndUpdate = useCallback(
    (contractData: Partial<Contract>) => {
      if (storedContract) {
        updateContract(contractId, contractData)
      } else if (contractData.id) {
        setContract(contractData as Required<Contract>)
      }
    },
    [contractId, setContract, storedContract, updateContract],
  )

  useHandlePushNotifications(
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
        updateContract(contract.id, { error: 'DECRYPTION_ERROR' })

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
    updateContract,
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
