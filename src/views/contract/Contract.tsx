import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Button, Icon, Loading, PeachScrollView, SatsFormat, Text, Timer, Title } from '../../components'
import { TIMERS } from '../../constants'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import ConfirmPayment from '../../overlays/info/ConfirmPayment'
import Payment from '../../overlays/info/Payment'
import YouGotADispute from '../../overlays/YouGotADispute'
import { account } from '../../utils/account'
import { contractIdToHex, getContract, saveContract, signReleaseTx } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { getOffer } from '../../utils/offer'
import { isTradeComplete } from '../../utils/offer/getOfferStatus'
import { confirmPayment } from '../../utils/peachAPI'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { ContractSummary } from '../yourTrades/components/ContractSummary'
import { getRequiredAction } from './helpers/getRequiredAction'
import { getTimerStart } from './helpers/getTimerStart'
import { parseContract } from './helpers/parseContract'
import { DisputeResult } from '../../overlays/DisputeResult'
import ContractCTA from './components/ContractCTA'

export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const ws = useContext(PeachWSContext)

  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [updatePending, setUpdatePending] = useState(true)
  const [loading, setLoading] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(() => getContract(contractId))
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  const initContract = () => {
    if (contract?.id !== route.params.contractId) {
      setContractId(() => route.params.contractId)
      setUpdatePending(true)
      setView('')
      setRequiredAction('none')
      setContract(getContract(route.params.contractId))
    }
  }

  useFocusEffect(useCallback(initContract, [route]))

  useFocusEffect(useCallback(() => {
    const contractUpdateHandler = async (update: ContractUpdate) => {
      if (!contract || update.contractId !== contract.id) return
      setContract({
        ...contract,
        [update.event]: new Date(update.data.date)
      })
    }
    const messageHandler = async (message: Message) => {
      if (!contract) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      setContract({
        ...contract,
        messages: contract.messages + 1
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
  }, [contract, ws.connected]))

  useFocusEffect(useCallback(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)
      const c = getContract(result.id)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')

      const { symmetricKey, paymentData } = await parseContract({
        ...result,
        symmetricKey: c?.symmetricKey,
        paymentData: c?.paymentData,
      })

      saveAndUpdate(c
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
        }
      )

      if (result.disputeActive
        && result.disputeInitiator !== account.publicKey
        && !result.disputeAcknowledgedByCounterParty) {
        updateOverlay({
          content: <YouGotADispute
            contractId={result.id}
            message={result.disputeClaim!}
            reason={result.disputeReason!}
            navigation={navigation} />,
          showCloseButton: false
        })
      }

      if (result.disputeResolvedDate && !contract?.disputeResultAcknowledged) {
        updateOverlay({
          content: <DisputeResult
            contractId={result.id}
            navigation={navigation} />,
        })
      }
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId]))

  useEffect(() => {
    if (!contract || !view || contract.canceled) return

    if (isTradeComplete(contract)) {
      if (view === 'buyer' && !contract.ratingSeller || view === 'seller' && !contract.ratingBuyer) {
        navigation.replace('tradeComplete', { contract })
      } else {
        const offer = getOffer(contract.id.split('-')[view === 'seller' ? 0 : 1]) as BuyOffer|SellOffer
        navigation.replace('offer', { offer })
      }
      return
    }

    (async () => {
      setRequiredAction(getRequiredAction(contract))
      setUpdatePending(false)
    })()
  }, [contract])

  const postConfirmPaymentBuyer = async () => {
    if (!contract) return

    const [result, err] = await confirmPayment({ contractId: contract.id })

    if (err) {
      error(err.error)
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentMade: new Date()
    })
  }

  const postConfirmPaymentSeller = async () => {
    if (!contract) return
    setLoading(true)

    const [tx, errorMsg] = signReleaseTx(contract)

    if (!tx) {
      setLoading(false)
      updateMessage({
        msg: errorMsg!.join('\n'),
        level: 'WARN',
      })
      return
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || ''
    })
  }

  const openPaymentHelp = () => updateOverlay({
    content: <Payment />,
    showCloseButton: true, help: true
  })

  return !contract || updatePending
    ? <Loading />
    : <PeachScrollView style={tw`pt-6`} contentContainerStyle={tw`px-6`}>
      <View style={tw`pb-32`}>
        <Title title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}/>
        <Text style={tw`text-grey-2 text-center -mt-1`}>
          {i18n('contract.subtitle')} <SatsFormat sats={contract.amount} color={tw`text-grey-2`} />
        </Text>
        <Text style={tw`text-center text-grey-2 mt-2`}>{i18n('contract.trade', contractIdToHex(contract.id))}</Text>
        {!contract.paymentConfirmed
          ? <View style={tw`mt-16`}>
            <ContractSummary contract={contract} view={view} navigation={navigation} />
            <View style={tw`mt-16 flex-row justify-center`}>
              {/sendPayment/u.test(requiredAction) || requiredAction === 'confirmPayment' && view === 'seller'
                ? <View style={tw`absolute bottom-full mb-1 flex-row items-center`}>
                  <Timer
                    text={i18n(`contract.timer.${requiredAction}.${view}`)}
                    start={getTimerStart(contract, requiredAction)}
                    duration={TIMERS[requiredAction]}
                    style={tw`flex-shrink`}
                  />
                  {view === 'buyer' && requiredAction === 'sendPayment'
                    ? <Pressable onPress={openPaymentHelp} style={tw`flex-row items-center p-1 -mt-0.5`}>
                      <View style={tw`w-6 h-6 -ml-2 flex items-center justify-center`}>
                        <Icon id="help" style={tw`w-4 h-4`} color={tw`text-blue-1`.color as string} />
                      </View>
                    </Pressable>
                    : null
                  }
                </View>
                : null
              }
              <ContractCTA
                view={view}
                requiredAction={requiredAction}
                loading={loading}
                postConfirmPaymentBuyer={postConfirmPaymentBuyer}
                postConfirmPaymentSeller={postConfirmPaymentSeller}
              />
            </View>
          </View>
          : null
        }
      </View>
    </PeachScrollView>
}