import messaging from '@react-native-firebase/messaging'
import React, { ReactElement, useCallback, useContext, useState } from 'react'
import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { View } from 'react-native'
import { Loading, PeachScrollView, Text, Title } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { useMatchStore } from '../../components/matches/store'
import AppContext from '../../contexts/app'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { useNavigation, useRoute } from '../../hooks'
import MatchAccepted from '../../overlays/MatchAccepted'
import { getChatNotifications } from '../../utils/chat'
import { getContract } from '../../utils/contract'
import { isTradeComplete } from '../../utils/contract/status'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { getOffer, getRequiredActionCount, isSellOffer, offerIdToHex, saveOffer } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { toShortDateFormat } from '../../utils/date'
import { handleOverlays } from '../contract/helpers/handleOverlays'
import { ContractSummary } from './components/ContractSummary'
import { OfferSummary } from './components/OfferSummary'

export default (): ReactElement => {
  const route = useRoute<'offer'>()
  const offerId = route.params.offerId
  const navigation = useNavigation()
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)
  const [offer, setOffer] = useState(() => getOffer(offerId))
  const view = !!offer && isSellOffer(offer) ? 'seller' : 'buyer'
  const [contract, setContract] = useState(() => (offer?.contractId ? getContract(offer.contractId) : null))
  const [contractId, setContractId] = useState(offer?.contractId)
  const [pnReceived, setPNReceived] = useState(0)

  const finishedDate = contract?.paymentConfirmed
  const subtitle
    = contract && offer
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
    setOffer(offerData)
  }

  const goToOffer = () => {
    if (!offer?.newOfferId) return
    const offr = getOffer(offer.newOfferId)
    if (offr?.id) navigation.replace('offer', { offerId: offr.id })
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
          const updatedOffer = {
            ...(offer || {}),
            ...result,
          }
          saveAndUpdate(updatedOffer)

          if (result.online && result.matches.length && !result.contractId) {
            info('Offer.tsx - getOfferDetailsEffect', `navigate to search ${updatedOffer.id}`)
            matchStoreSetOffer(updatedOffer)
            navigation.replace('search')
          }
          if (result.contractId) setContractId(result.contractId)
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
      [pnReceived, offerId],
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

          if (!result.paymentMade && !result.canceled) {
            info('Offer.tsx - getContractEffect', `navigate to contract ${result.id}`)
            navigation.replace('contract', { contractId: result.id })
          }
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

  return !offer ? (
    <View style={tw`flex items-center justify-center h-full`}>
      <Loading />
    </View>
  ) : (
    <PeachScrollView contentContainerStyle={tw`px-6 pt-5 pb-10`}>
      {/offerPublished|searchingForPeer|offerCanceled/u.test(offer.tradeStatus) && (
        <OfferSummary offer={offer} status={offer.tradeStatus} />
      )}
      {contract && /tradeCompleted|tradeCanceled/u.test(offer.tradeStatus) && (
        <View>
          <Title title={i18n(`${isSellOffer(offer) ? 'sell' : 'buy'}.title`)} subtitle={subtitle} />
          {offer.newOfferId ? (
            <Text style={tw`leading-6 text-center text-grey-2`} onPress={goToOffer}>
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
