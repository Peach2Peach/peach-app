import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useEffect, useState } from 'react'
import { FIFTEEN_SECONDS } from '../constants'
import { useHandleContractPopups } from '../popups/useHandleContractPopups'
import { useLocalContractStore } from '../store/useLocalContractStore'
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
  const showError = useShowErrorBanner()
  const handleContractPopups = useHandleContractPopups()
  const { contract, isLoading, refetch } = useContractDetails(contractId, FIFTEEN_SECONDS)
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const [storedContract, setStoredContract] = useState(getContract(contractId))
  const view = contract ? getContractViewer(contract.seller.id) : undefined
  const requiredAction = storedContract ? getRequiredAction(storedContract) : 'none'
  const [decryptionError, setDecryptionError] = useState(false)
  const setLocalContract = useLocalContractStore((state) => state.setContract)

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
      const contractUpdateHandler = (update: ContractUpdate) => {
        if (!storedContract || update.contractId !== contractId || !update.event) return
        saveAndUpdate({
          [update.event]: new Date(update.data.date),
        })
      }
      const messageHandler = (message: Message) => {
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
        saveAndUpdate(contract)
        setLocalContract({ ...contract, error: 'DECRYPTION_ERROR' })

        return setDecryptionError(true)
      }

      return saveAndUpdate({ ...contract, symmetricKey, paymentData })
    })()
  }, [
    contract,
    decryptionError,
    saveAndUpdate,
    setLocalContract,
    showError,
    storedContract?.paymentData,
    storedContract?.symmetricKey,
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
    handleContractPopups(storedContract, getContractViewer(storedContract.seller.id))
  }, [storedContract, handleContractPopups])

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
