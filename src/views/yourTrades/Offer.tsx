import messaging from '@react-native-firebase/messaging'
import React, { ReactElement, useCallback, useContext, useState } from 'react'
import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { View } from 'react-native'
import { PeachScrollView, Text, Title } from '../../components'
import AppContext from '../../contexts/app'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { useNavigation, useRoute } from '../../hooks'
import MatchAccepted from '../../overlays/MatchAccepted'
import { getChatNotifications } from '../../utils/chat'
import { getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { getOffer, getRequiredActionCount, isSellOffer, offerIdToHex, saveOffer } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { toShortDateFormat } from '../../utils/string'
import { handleOverlays } from '../contract/helpers/handleOverlays'
import { ContractSummary } from './components/ContractSummary'
import { OfferSummary } from './components/OfferSummary'
import { getOfferStatus } from '../../utils/offer/status'
import { isTradeComplete } from '../../utils/contract/status'
import { PrimaryButton } from '../../components/buttons'

export default (): ReactElement => {
  const offerId = useRoute<'offer'>().params.offer.id!
  const navigation = useNavigation()
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)

  const offer = getOffer(offerId)!
  const view = isSellOffer(offer) ? 'seller' : 'buyer'
  const [contract, setContract] = useState(() => (offer?.contractId ? getContract(offer.contractId) : null))
  const [contractId, setContractId] = useState(offer?.contractId)
  const [pnReceived, setPNReceived] = useState(0)

  const offerStatus = getOfferStatus(offer)
  const finishedDate = contract?.paymentConfirmed
  const subtitle = contract
    ? isTradeComplete(contract)
      ? i18n(
        'yourTrades.offerCompleted.subtitle',
        offerIdToHex(offer.id as Offer['id']),
        finishedDate ? toShortDateFormat(finishedDate) : '',
      )
      : i18n('yourTrades.tradeCanceled.subtitle')
    : ''

  const saveAndUpdate = (offerData: BuyOffer | SellOffer) => {
    saveOffer(offerData)
  }

  const goToOffer = () => {
    if (!offer.newOfferId) return
    const offr = getOffer(offer.newOfferId)
    if (offr) navigation.replace('offer', { offer: offr })
  }

  useFocusEffect(
    useCallback(() => {
      const messageHandler = async (message: Message) => {
        if (!contract) return
        if (!message.message || message.roomId !== `contract-${contract.id}`) return

        setContract({
          ...contract,
          unreadMessages: contract.unreadMessages + 1,
        })
      }
      const unsubscribe = () => {
        ws.off('message', messageHandler)
      }

      if (!ws.connected) return unsubscribe

      ws.on('message', messageHandler)

      return unsubscribe
    }, [contract, ws.connected]),
  )

  useFocusEffect(
    useCallback(
      getOfferDetailsEffect({
        offerId,
        interval: 30 * 1000,
        onSuccess: (result) => {
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
        onError: (err) => {
          error('Could not fetch offer information for offer', offerId)
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
        },
      }),
      [pnReceived, offer],
    ),
  )

  useFocusEffect(
    useCallback(
      getContractEffect({
        contractId,
        onSuccess: async (result) => {
          const c = {
            ...getContract(result.id),
            ...result,
          }
          setContract(c)
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
          handleOverlays({ contract: c, updateOverlay, view })
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
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null | void> => {
        if (!remoteMessage.data) return

        if (remoteMessage.data.type === 'offer.matchSeller') {
          setPNReceived(Math.random())
        } else if (remoteMessage.data.type === 'contract.contractCreated' && remoteMessage.data.offerId !== offerId) {
          updateOverlay({
            content: <MatchAccepted contractId={remoteMessage.data.contractId} />,
            visible: true,
          })
        }
      })

      return unsubscribe
    }, []),
  )

  return (
    <PeachScrollView contentContainerStyle={tw`pt-5 pb-10 px-6`}>
      {/offerPublished|searchingForPeer|offerCanceled/u.test(offerStatus.status) && (
        <OfferSummary offer={offer} status={offerStatus.status} />
      )}
      {contract && /tradeCompleted|tradeCanceled/u.test(offerStatus.status) && (
        <View>
          <Title title={i18n(`${isSellOffer(offer) ? 'sell' : 'buy'}.title`)} subtitle={subtitle} />
          {offer.newOfferId ? (
            <Text style={tw`text-center leading-6 text-grey-2`} onPress={goToOffer}>
              {i18n('yourTrades.offer.replaced', offerIdToHex(offer.newOfferId))}
            </Text>
          ) : null}
          <View style={tw`mt-7`}>
            <ContractSummary {...{ contract, view }} />
            <PrimaryButton style={tw`self-center mt-4`} onPress={() => navigation.navigate('yourTrades')} narrow>
              {i18n('back')}
            </PrimaryButton>
          </View>
        </View>
      )}
    </PeachScrollView>
  )
}
