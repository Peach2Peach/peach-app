import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useContext, useState } from 'react'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { View } from 'react-native'
import { Button, PeachScrollView, Title } from '../../components'
import { MessageContext } from '../../contexts/message'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { contractIdToHex, getContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { getOffer, getOfferStatus, saveOffer } from '../../utils/offer'
import { isTradeComplete } from '../../utils/offer/getOfferStatus'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { toShortDateFormat } from '../../utils/string'
import { ContractSummary } from './components/ContractSummary'
import { OfferSummary } from './components/OfferSummary'

export type OfferScreenNavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>

type Props = {
  route: RouteProp<{ params: {
    offer: BuyOffer|SellOffer,
  } }>,
  navigation: OfferScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const ws = useContext(PeachWSContext)
  const [, updateMessage] = useContext(MessageContext)

  const offerId = route.params.offer.id as string
  const offer = getOffer(offerId) as BuyOffer|SellOffer
  const [contract, setContract] = useState(() => offer?.contractId ? getContract(offer.contractId) : null)
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
      }
    },
    onError: err => {
      error('Could not fetch offer information for offer', offerId)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [offer]))

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