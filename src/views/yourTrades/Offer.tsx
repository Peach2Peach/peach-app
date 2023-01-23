import messaging from '@react-native-firebase/messaging'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { View } from 'react-native'
import { Button, Loading, PeachScrollView, Text, Title } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import MatchAccepted from '../../overlays/MatchAccepted'
import { getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { getOffer, offerIdToHex, getRequiredActionCount, saveOffer, isSellOffer } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { toShortDateFormat } from '../../utils/string'
import { handleOverlays } from '../contract/helpers/handleOverlays'
import { ContractSummary } from './components/ContractSummary'
import { OfferSummary } from './components/OfferSummary'
import AppContext from '../../contexts/app'
import { getChatNotifications } from '../../utils/chat'
import { getOfferStatus } from '../../utils/offer/status'
import { isTradeComplete } from '../../utils/contract/status'
import { useMatchStore } from '../../components/matches/store'

type Props = {
  route: RouteProp<{ params: RootStackParamList['offer'] }>
  navigation: StackNavigation
}

export default ({ route, navigation }: Props): ReactElement => {
  const ws = useContext(PeachWSContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const [offer, setOffer] = useState(() => getOffer(route.params.offerId))
  const view = offer && isSellOffer(offer) ? 'seller' : 'buyer'
  const [contract, setContract] = useState(() => (offer?.contractId ? getContract(offer.contractId) : null))
  const [contractId, setContractId] = useState(offer?.contractId)
  const [pnReceived, setPNReceived] = useState(0)

  const offerStatus = offer ? getOfferStatus(offer) : null

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
    setOffer(offerData)

    const newOfferStatus = getOfferStatus(offerData)
    if (offerData.contractId && !/tradeCompleted|tradeCanceled/u.test(newOfferStatus.status)) {
      info('Offer.tsx - saveAndUpdate', `navigate to contract ${offerData.contractId}`)
      navigation.replace('contract', { contractId: offerData.contractId })
    } else if (offerData.contractId) {
      setContractId(offerData.contractId)
    }
  }

  const goToOffer = () => {
    if (!offer?.newOfferId) return
    navigation.replace('offer', { offerId: offer.newOfferId })
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
        offerId: route.params.offerId,
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
        },
        onError: (err) => {
          error('Could not fetch offer information for offer', route.params.offerId)
          updateMessage({
            msgKey: err.error || 'error.general',
            level: 'ERROR',
          })
        },
      }),
      [pnReceived, route],
    ),
  )

  useFocusEffect(
    useCallback(
      getContractEffect({
        contractId,
        onSuccess: async (result) => {
          const c = {
            ...(getContract(result.id) || {}),
            ...result,
          }
          setContract(c)
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
          handleOverlays({ contract: c, navigation, updateOverlay, view })
        },
        onError: (err) =>
          updateMessage({
            msgKey: err.error || 'error.general',
            level: 'ERROR',
          }),
      }),
      [contractId, navigation, updateAppContext, updateMessage, updateOverlay, view],
    ),
  )

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null | void> => {
        if (!remoteMessage.data) return

        if (remoteMessage.data.type === 'offer.matchSeller') {
          setPNReceived(Math.random())
        } else if (
          remoteMessage.data.type === 'contract.contractCreated'
          && remoteMessage.data.offerId !== route.params.offerId
        ) {
          updateOverlay({
            content: <MatchAccepted contractId={remoteMessage.data.contractId} />,
          })
        }
      })

      return unsubscribe
    }, [navigation, route, updateOverlay]),
  )

  if (!offer || !offerStatus) return <Loading />

  return (
    <PeachScrollView contentContainerStyle={tw`px-6 pt-5 pb-10`}>
      {/offerPublished|searchingForPeer|offerCanceled/u.test(offerStatus.status) ? (
        <OfferSummary offer={offer} status={offerStatus.status} navigation={navigation} />
      ) : null}
      {contract && /tradeCompleted|tradeCanceled/u.test(offerStatus.status) ? (
        <View>
          <Title title={i18n(`${isSellOffer(offer) ? 'sell' : 'buy'}.title`)} subtitle={subtitle} />
          {offer.newOfferId ? (
            <Text style={tw`leading-6 text-center text-grey-2`} onPress={goToOffer}>
              {i18n('yourTrades.offer.replaced', offerIdToHex(offer.newOfferId))}
            </Text>
          ) : null}
          <View style={tw`mt-7`}>
            <ContractSummary contract={contract} view={view} navigation={navigation} />
            <View style={tw`flex items-center mt-4`}>
              <Button
                title={i18n('back')}
                secondary={true}
                wide={false}
                onPress={() => navigation.navigate('yourTrades', {})}
              />
            </View>
          </View>
        </View>
      ) : null}
    </PeachScrollView>
  )
}
