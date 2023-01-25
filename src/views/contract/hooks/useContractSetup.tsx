import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { CancelIcon, HelpIcon } from '../../../components/icons'
import AppContext from '../../../contexts/app'
import { MessageContext } from '../../../contexts/message'
import { OverlayContext } from '../../../contexts/overlay'
import getContractEffect from '../../../effects/getContractEffect'
import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useContractDetails } from '../../../hooks/useContractDetails'
import { useOfferDetails } from '../../../hooks/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useConfirmCancelTrade } from '../../../overlays/tradeCancelation/useConfirmCancelTrade'
import { account } from '../../../utils/account'
import { getChatNotifications } from '../../../utils/chat'
import {
  canCancelContract,
  getContract,
  getContractViewer,
  getOfferIdFromContract,
  saveContract,
  signReleaseTx,
} from '../../../utils/contract'
import { isTradeCanceled, isTradeComplete } from '../../../utils/contract/status'
import i18n from '../../../utils/i18n'
import { getRequiredActionCount, saveOffer } from '../../../utils/offer'
import { confirmPayment } from '../../../utils/peachAPI'
import { PeachWSContext } from '../../../utils/peachAPI/websocket'
import ContractTitle from '../components/ContractTitle'
import { decryptContractData } from '../helpers/decryptContractData'
import { getRequiredAction } from '../helpers/getRequiredAction'
import { handleOverlays } from '../helpers/handleOverlays'

// eslint-disable-next-line max-lines-per-function, max-statements
export const useContractSetup = () => {
  const route = useRoute<'contract'>()
  const { contractId } = route.params

  const navigation = useNavigation()
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)
  const showError = useShowErrorBanner()
  const cancelContract = useConfirmCancelTrade(contractId)
  const showMakePaymentHelp = useShowHelp('makePayment')
  const showConfirmPaymentHelp = useShowHelp('confirmPayment')

  const [actionPending, setActionPending] = useState(false)
  const { contract, isLoading } = useContractDetails(contractId)
  const { offer } = useOfferDetails(contract ? getOfferIdFromContract(contract) : '')
  const [storedContract, setStoredContract] = useState(getContract(contractId))
  const view = contract ? getContractViewer(contract, account) : undefined
  const requiredAction = contract ? getRequiredAction(contract) : 'none'

  useHeaderSetup(
    useMemo(() => {
      const icons = []
      if (contract && canCancelContract(contract)) icons.push({
        iconComponent: <CancelIcon />,
        onPress: cancelContract,
      })
      if (view === 'buyer' && requiredAction === 'sendPayment') icons.push({
        iconComponent: <HelpIcon />,
        onPress: showMakePaymentHelp,
      })
      if (view === 'seller' && requiredAction === 'confirmPayment') icons.push({
        iconComponent: <HelpIcon />,
        onPress: showConfirmPaymentHelp,
      })
      return {
        titleComponent: <ContractTitle id={contractId} amount={contract?.amount} />,
        icons,
      }
    }, [cancelContract, contract, requiredAction, contractId, showConfirmPaymentHelp, showMakePaymentHelp, view]),
  )

  const saveAndUpdate = (contractData: Contract): Contract => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    saveContract(contractData)
    updateAppContext({
      notifications: getChatNotifications() + getRequiredActionCount(),
    })
    return contractData
  }

  useFocusEffect(
    useCallback(() => {
      const contractUpdateHandler = async (update: ContractUpdate) => {
        if (!storedContract || update.contractId !== contractId || !update.event) return
        setStoredContract({
          ...storedContract,
          [update.event]: new Date(update.data.date),
        })
      }
      const messageHandler = async (message: Message) => {
        if (!storedContract) return
        if (!message.message || message.roomId !== `contract-${contractId}`) return

        setStoredContract({
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
    }, [contractId, storedContract, ws]),
  )

  useFocusEffect(
    useCallback(
      getContractEffect({
        contractId,
        onSuccess: async (result) => {
          let c = getContract(result.id)
          const v = account.publicKey === result.seller.id ? 'seller' : 'buyer'

          const { symmetricKey, paymentData } = await decryptContractData({
            ...result,
            symmetricKey: c?.symmetricKey,
            paymentData: c?.paymentData,
          })

          c = saveAndUpdate(
            c
              ? {
                ...c,
                ...result,
                symmetricKey,
                paymentData,
              }
              : {
                ...result,
                symmetricKey,
                paymentData,
              },
          )

          handleOverlays({ contract: c, updateOverlay, view: v })
        },
        onError: (err) =>
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          }),
      }),
      [contractId],
    ),
  )

  useEffect(() => {
    if (offer) saveOffer(offer, false)
  }, [offer])

  useEffect(() => {
    if (!contract || !view || isLoading) return

    if (isTradeComplete(contract)) {
      if (
        (!contract.disputeWinner && view === 'buyer' && !contract.ratingSeller && !contract.canceled)
        || (view === 'seller' && !contract.ratingBuyer)
      ) {
        navigation.replace('tradeComplete', { contract })
        return
      }

      navigation.replace('offer', { offerId: getOfferIdFromContract(contract) })
    } else if (isTradeCanceled(contract)) {
      navigation.replace('offer', { offerId: getOfferIdFromContract(contract) })
    }
  }, [contract, isLoading, navigation, view])

  const postConfirmPaymentBuyer = useCallback(async () => {
    if (!storedContract) return

    const [, err] = await confirmPayment({ contractId })

    if (err) {
      showError(err.error)

      return
    }

    saveAndUpdate({
      ...storedContract,
      paymentMade: new Date(),
    })
  }, [contractId, saveAndUpdate, showError, storedContract])

  const postConfirmPaymentSeller = useCallback(async () => {
    if (!storedContract) return
    setActionPending(true)

    const [tx, errorMsg] = signReleaseTx(storedContract)

    if (!tx) {
      setActionPending(false)
      showError(errorMsg)
      return
    }

    const [result, err] = await confirmPayment({ contractId, releaseTransaction: tx })

    setActionPending(false)

    if (err) {
      showError(err.error)
      return
    }

    saveAndUpdate({
      ...storedContract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
    })
  }, [contractId, saveAndUpdate, showError, storedContract])

  return {
    contract: storedContract,
    isLoading,
    view,
    requiredAction,
    actionPending,
    postConfirmPaymentBuyer,
    postConfirmPaymentSeller,
  }
}
