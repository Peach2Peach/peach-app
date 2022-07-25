import React, { ReactElement, useCallback, useContext, useState } from 'react'
import messaging from '@react-native-firebase/messaging'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { View } from 'react-native'
import { Button, PeachScrollView, Title } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { DisputeResult } from '../../overlays/DisputeResult'
import YouGotADispute from '../../overlays/YouGotADispute'
import { account } from '../../utils/account'
import { contractIdToHex, getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { getOffer, getOfferStatus, saveOffer } from '../../utils/offer'
import { isTradeComplete } from '../../utils/offer/getOfferStatus'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { toShortDateFormat } from '../../utils/string'
import { ContractSummary } from './components/ContractSummary'
import { OfferSummary } from './components/OfferSummary'
import MatchAccepted from '../../overlays/MatchAccepted'

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer|SellOffer,
  } }>,
  navigation: StackNavigation,
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const offerId = route.params.offer.id as string
  const offer = getOffer(offerId) as BuyOffer|SellOffer
  const [contract, setContract] = useState(() => offer?.contractId ? getContract(offer.contractId) : null)
  const [contractId, setContractId] = useState(offer?.contractId)
  const [pnReceived, setPNReceived] = useState(0)

  const offerStatus = getOfferStatus(offer)
  const finishedDate = contract?.paymentConfirmed
  const subtitle = contract
    ? isTradeComplete(contract)
      ? i18n('yourTrades.offerCompleted.subtitle',
        contractIdToHex(contract.id),
        finishedDate ? toShortDateFormat(finishedDate) : ''
      )
      : i18n('yourTrades.tradeCanceled.subtitle')
    : ''

  const saveAndUpdate = (offerData: BuyOffer|SellOffer) => {
    saveOffer(offerData)
  }

  useFocusEffect(useCallback(() => {
    const messageHandler = async (message: Message) => {
      if (!contract) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      setContract({
        ...contract,
        messages: contract.messages + 1
      })
    }
    const unsubscribe = () => {
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', messageHandler)

    return unsubscribe
  }, [contract, ws.connected]))

  useFocusEffect(useCallback(getOfferDetailsEffect({
    offerId,
    interval: 30 * 1000,
    onSuccess: result => {
      if (!offer) return

      saveAndUpdate({
        ...offer,
        ...result,
      })

      if (result.online && result.matches.length && !result.contractId) {
        info('Offer.tsx - getOfferDetailsEffect', `navigate to search ${offer.id}`)
        navigation.replace('search', { offer })
      }
      if (result.contractId && !/tradeCompleted|tradeCanceled/u.test(offerStatus.status)) {
        info('Offer.tsx - getOfferDetailsEffect', `navigate to contract ${result.contractId}`)
        navigation.replace('contract', { contractId: result.contractId })
      } else if (result.contractId) {
        setContractId(contractId)
      }
    },
    onError: err => {
      error('Could not fetch offer information for offer', offerId)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [pnReceived, offer]))

  useFocusEffect(useCallback(getContractEffect({
    contractId,
    onSuccess: async (result) => {

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
      if (result.disputeWinner && !contract?.disputeResultAcknowledged) {
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

  useFocusEffect(useCallback(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null|void> => {
      if (!remoteMessage.data) return

      if (remoteMessage.data.type === 'offer.matchSeller') {
        setPNReceived(Math.random())
      } else if (remoteMessage.data.type === 'contract.contractCreated' && remoteMessage.data.offerId !== offerId) {
        updateOverlay({
          content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigation} />,
        })
      }
    })

    return unsubscribe
  }, []))

  return <PeachScrollView contentContainerStyle={tw`pt-5 pb-10 px-6`}>
    {/offerPublished|searchingForPeer|offerCanceled/u.test(offerStatus.status)
      ? <OfferSummary offer={offer} status={offerStatus.status} navigation={navigation} />
      : null
    }
    {contract && /tradeCompleted|tradeCanceled/u.test(offerStatus.status)
      ? <View>
        <Title title={i18n(`${offer.type === 'ask' ? 'sell' : 'buy'}.title`)} subtitle={subtitle}/>
        <View style={tw`mt-7`}>
          <ContractSummary
            contract={contract} view={offer.type === 'ask' ? 'seller' : 'buyer'}
            navigation={navigation}
          />
          <View style={tw`flex items-center mt-4`}>
            <Button
              title={i18n('back')}
              secondary={true}
              wide={false}
              onPress={() => navigation.replace('yourTrades', {})}
            />
          </View>
        </View>
      </View>
      : null
    }
  </PeachScrollView>
}