/* eslint-disable max-lines */
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Icon, Loading, PeachScrollView, SatsFormat, Text, Timer, Title, TradeSummary } from '../../components'
import { ChatButton } from '../../components/chat/ChatButton'
import { TIMERS } from '../../constants'
import AppContext from '../../contexts/app'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { useNavigation, useRoute } from '../../hooks'
import Payment from '../../overlays/info/Payment'
import { account } from '../../utils/account'
import { getChatNotifications } from '../../utils/chat'
import { contractIdToHex, getContract, getOfferIdFromContract, saveContract, signReleaseTx } from '../../utils/contract'
import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { getRequiredActionCount, saveOffer } from '../../utils/offer'
import { confirmPayment } from '../../utils/peachAPI'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import ContractCTA from './components/ContractCTA'
import { decryptContractData } from './helpers/decryptContractData'
import { getRequiredAction } from './helpers/getRequiredAction'
import { getTimerStart } from './helpers/getTimerStart'
import { handleOverlays } from './helpers/handleOverlays'

export default (): ReactElement => {
  const route = useRoute<'contract'>()
  const navigation = useNavigation()
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)

  const [loading, setLoading] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState(route.params.contract || getContract(contractId))
  const [updatePending, setUpdatePending] = useState(!contract)
  const [view, setView] = useState<'seller' | 'buyer' | ''>(
    contract ? (account.publicKey === contract.seller.id ? 'seller' : 'buyer') : '',
  )
  const [requiredAction, setRequiredAction] = useState<ContractAction>(contract ? getRequiredAction(contract) : 'none')

  const saveAndUpdate = (contractData: Contract): Contract => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(contractData)
    saveContract(contractData)
    updateAppContext({
      notifications: getChatNotifications() + getRequiredActionCount(),
    })
    return contractData
  }

  const initContract = () => {
    if (contract?.id !== route.params.contractId) {
      const c = route.params.contract || getContract(route.params.contractId)
      setContractId(() => route.params.contractId)
      setUpdatePending(!c)
      setView(c ? (account.publicKey === c.seller.id ? 'seller' : 'buyer') : '')
      setRequiredAction(c ? getRequiredAction(c) : 'none')
      setContract(c)
    }
  }

  useFocusEffect(useCallback(initContract, [route]))

  useFocusEffect(
    useCallback(() => {
      const contractUpdateHandler = async (update: ContractUpdate) => {
        if (!contract || update.contractId !== contract.id || !update.event) return
        setContract({
          ...contract,
          [update.event]: new Date(update.data.date),
        })
      }
      const messageHandler = async (message: Message) => {
        if (!contract) return
        if (!message.message || message.roomId !== `contract-${contract.id}`) return

        setContract({
          ...contract,
          unreadMessages: contract.unreadMessages + 1,
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
    }, [contract, ws.connected]),
  )

  useFocusEffect(
    useCallback(
      getContractEffect({
        contractId,
        onSuccess: async (result) => {
          let c = getContract(result.id)
          const v = account.publicKey === result.seller.id ? 'seller' : 'buyer'
          setView(v)

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

  useFocusEffect(
    useCallback(
      getOfferDetailsEffect({
        offerId: contract ? getOfferIdFromContract(contract) : undefined,
        onSuccess: async (result) => {
          saveOffer(result, false)
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
      [contract],
    ),
  )

  useEffect(() => {
    if (!contract || !view || updatePending) return

    if (isTradeComplete(contract)) {
      if (
        (!contract.disputeWinner && view === 'buyer' && !contract.ratingSeller && !contract.canceled)
        || (view === 'seller' && !contract.ratingBuyer)
      ) {
        navigation.replace('tradeComplete', { contract })
        return
      }

      navigation.replace('offer', { offerId: getOfferIdFromContract(contract) })
      return
    } else if (isTradeCanceled(contract)) {
      navigation.replace('offer', { offerId: getOfferIdFromContract(contract) })
      return
    }

    setRequiredAction(getRequiredAction(contract))
    setUpdatePending(false)
  }, [contract, navigation, updatePending, view])

  const postConfirmPaymentBuyer = async () => {
    if (!contract) return

    const [, err] = await confirmPayment({ contractId: contract.id })

    if (err) {
      error(err.error)
      updateMessage({
        msgKey: err.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentMade: new Date(),
    })
  }

  const postConfirmPaymentSeller = async () => {
    if (!contract) return
    setLoading(true)

    const [tx, errorMsg] = signReleaseTx(contract)

    if (!tx) {
      setLoading(false)
      updateMessage({
        msgKey: errorMsg || 'GENERAL_ERROR',
        level: 'WARN',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
      return
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({
        msgKey: err.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
    })
  }

  const openPaymentHelp = () =>
    updateOverlay({
      content: <Payment />,
      visible: true,
    })

  return !contract || updatePending ? (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
    <PeachScrollView style={tw`pt-6`} contentContainerStyle={tw`px-6`}>
      <View style={tw`pb-32`}>
        <Title title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')} />
        <Text style={tw`-mt-1 text-center text-grey-2`}>
          {i18n('contract.subtitle')} <SatsFormat sats={contract.amount} color={tw`text-grey-2`} />
        </Text>
        <Text style={tw`mt-2 text-center text-grey-2`}>{i18n('contract.trade', contractIdToHex(contract.id))}</Text>
        {!contract.canceled && !contract.paymentConfirmed ? (
          <View style={tw`mt-16`}>
            <View>
              <ChatButton contract={contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
              <TradeSummary {...{ contract, view }} />
            </View>
            <View style={tw`flex-row justify-center mt-16`}>
              {/sendPayment/u.test(requiredAction) ? (
                <View style={tw`absolute flex-row items-center mb-1 bottom-full`}>
                  <Timer
                    text={i18n(`contract.timer.${requiredAction}.${view}`)}
                    start={getTimerStart(contract, requiredAction)}
                    duration={TIMERS[requiredAction]}
                    style={tw`flex-shrink`}
                  />
                  {view === 'buyer' && requiredAction === 'sendPayment' ? (
                    <Pressable onPress={openPaymentHelp} style={tw`p-2`}>
                      <Icon id="helpCircle" style={tw`w-4 h-4`} color={tw`text-blue-1`.color} />
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
              <ContractCTA {...{ view, requiredAction, loading, postConfirmPaymentBuyer, postConfirmPaymentSeller }} />
            </View>
          </View>
        ) : null}
      </View>
    </PeachScrollView>
  )
}
