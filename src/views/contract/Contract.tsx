import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Icon, Loading, PeachScrollView, SatsFormat, Text, Timer, Title } from '../../components'
import { TIMERS } from '../../constants'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import Payment from '../../overlays/info/Payment'
import { account } from '../../utils/account'
import { getContract, getOfferIdfromContract, saveContract, signReleaseTx } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { getOffer, getRequiredActionCount } from '../../utils/offer'
import { isTradeCanceled, isTradeComplete } from '../../utils/offer/status'
import { confirmPayment } from '../../utils/peachAPI'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { ContractSummary } from '../yourTrades/components/ContractSummary'
import ContractCTA from './components/ContractCTA'
import { getRequiredAction } from './helpers/getRequiredAction'
import { getTimerStart } from './helpers/getTimerStart'
import { handleOverlays } from './helpers/handleOverlays'
import { parseContract } from './helpers/parseContract'
import { getChatNotifications } from '../../utils/chat'
import AppContext from '../../contexts/app'

type Props = {
  route: RouteProp<{ params: RootStackParamList['contract'] }>
  navigation: StackNavigation
}

export default ({ route, navigation }: Props): ReactElement => {
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)

  const [loading, setLoading] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract | null>(() => route.params.contract || getContract(contractId))
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

          const { symmetricKey, paymentData } = await parseContract({
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

          handleOverlays({ contract: c, navigation, updateOverlay, view: v })
        },
        onError: (err) =>
          updateMessage({
            msgKey: err.error || 'error.general',
            level: 'ERROR',
          }),
      }),
      [contractId],
    ),
  )

  useEffect(() => {
    if (!contract || !view) return

    if (isTradeComplete(contract)) {
      if (
        (!contract.disputeWinner && view === 'buyer' && !contract.ratingSeller && !contract.canceled)
        || (view === 'seller' && !contract.ratingBuyer)
      ) {
        navigation.replace('tradeComplete', { contract })
      } else {
        const offer = getOffer(contract.id.split('-')[view === 'seller' ? 0 : 1]) as BuyOffer | SellOffer
        navigation.replace('offer', { offer })
      }
      return
    } else if (isTradeCanceled(contract)) {
      const offer = getOffer(contract.id.split('-')[view === 'seller' ? 0 : 1]) as BuyOffer | SellOffer
      navigation.replace('offer', { offer })
      return
    }

    setRequiredAction(getRequiredAction(contract))
    setUpdatePending(false)
  }, [contract])

  const postConfirmPaymentBuyer = async () => {
    if (!contract) return

    const [, err] = await confirmPayment({ contractId: contract.id })

    if (err) {
      error(err.error)
      updateMessage({ msgKey: err.error || 'error.general', level: 'ERROR' })
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
        msgKey: errorMsg!.join('\n'),
        level: 'WARN',
      })
      return
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({ msgKey: err.error || 'error.general', level: 'ERROR' })
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
      showCloseButton: true,
      help: true,
    })

  return !contract || updatePending ? (
    <Loading />
  ) : (
    <PeachScrollView style={tw`pt-6`} contentContainerStyle={tw`px-6`}>
      <View style={tw`pb-32`}>
        <Title title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')} />
        <Text style={tw`text-grey-2 text-center -mt-1`}>
          {i18n('contract.subtitle')} <SatsFormat sats={contract.amount} color={tw`text-grey-2`} />
        </Text>
        <Text style={tw`text-center text-grey-2 mt-2`}>{i18n('contract.trade', getOfferIdfromContract(contract))}</Text>
        {!contract.canceled && !contract.paymentConfirmed ? (
          <View style={tw`mt-16`}>
            <ContractSummary contract={contract} view={view} navigation={navigation} />
            <View style={tw`mt-16 flex-row justify-center`}>
              {/sendPayment/u.test(requiredAction) ? (
                <View style={tw`absolute bottom-full mb-1 flex-row items-center`}>
                  <Timer
                    text={i18n(`contract.timer.${requiredAction}.${view}`)}
                    start={getTimerStart(contract, requiredAction)}
                    duration={TIMERS[requiredAction]}
                    style={tw`flex-shrink`}
                  />
                  {view === 'buyer' && requiredAction === 'sendPayment' ? (
                    <Pressable onPress={openPaymentHelp} style={tw`p-2`}>
                      <Icon id="help" style={tw`w-4 h-4`} color={tw`text-blue-1`.color as string} />
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
              <ContractCTA
                view={view}
                requiredAction={requiredAction}
                loading={loading}
                postConfirmPaymentBuyer={postConfirmPaymentBuyer}
                postConfirmPaymentSeller={postConfirmPaymentSeller}
              />
            </View>
          </View>
        ) : null}
      </View>
    </PeachScrollView>
  )
}
