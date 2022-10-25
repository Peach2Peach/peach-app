import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import AppContext from '../../contexts/app'
import { MessageContext } from '../../contexts/message'

import { useFocusEffect } from '@react-navigation/native'
import { Headline, PeachScrollView, Text, Title } from '../../components'
import getContractsEffect from '../../effects/getContractsEffect'
import getOffersEffect from '../../effects/getOffersEffect'
import { getAccount } from '../../utils/account'
import { storeContracts, storeOffers } from '../../utils/account/storeAccount'
import { getChatNotifications } from '../../utils/chat'
import { saveContracts } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { getOffers, getOfferStatus, getRequiredActionCount, saveOffers } from '../../utils/offer'
import { session } from '../../utils/session'
import { OfferItem } from './components/OfferItem'

type Props = {
  navigation: StackNavigation
}

const isPastOffer = (offer: SellOffer | BuyOffer) => {
  const { status } = getOfferStatus(offer)

  return /tradeCompleted|tradeCanceled|offerCanceled/u.test(status)
}
const isOpenOffer = (offer: SellOffer | BuyOffer) => !isPastOffer(offer)
const showOffer = (offer: SellOffer | BuyOffer) => {
  if (offer.contractId) return true
  if (offer.type === 'bid') {
    return offer.online
  }

  // filter out sell offer which has been canceled before funding escrow
  if (offer.funding?.status === 'CANCELED' && offer.funding.txIds?.length === 0 && !offer.txId) return false

  return true
}

const statusPriority = ['escrowWaitingForConfirmation', 'offerPublished', 'searchingForPeer', 'match', 'contractCreated']

const sortByStatus = (a: SellOffer | BuyOffer, b: SellOffer | BuyOffer) =>
  statusPriority.indexOf(getOfferStatus(a).status) - statusPriority.indexOf(getOfferStatus(b).status)

export default ({ navigation }: Props): ReactElement => {
  const [, updateAppContext] = useContext(AppContext)
  const [, updateMessage] = useContext(MessageContext)
  const [lastUpdate, setLastUpdate] = useState(new Date().getTime())
  const offers = getOffers()

  const allOpenOffers = offers.filter(isOpenOffer).filter(showOffer)
    .sort(sortByStatus)
  const openOffers = {
    buy: allOpenOffers.filter((o) => o.type === 'bid'),
    sell: allOpenOffers.filter((o) => o.type === 'ask'),
  }
  const pastOffers = offers.filter(isPastOffer).filter(showOffer)

  useFocusEffect(
    useCallback(
      getOffersEffect({
        onSuccess: (result) => {
          if (!result?.length) return
          saveOffers(result)

          if (session.password) storeOffers(getAccount().offers, session.password)

          setLastUpdate(new Date().getTime())
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
        },
        onError: (err) => {
          error('Could not fetch offer information')

          updateMessage({
            msgKey: err.error || 'error.general',
            level: 'ERROR',
          })
        },
      }),
      [],
    ),
  )

  useFocusEffect(
    useCallback(
      getContractsEffect({
        onSuccess: (result) => {
          if (!result?.length) return

          saveContracts(result)
          if (session.password) storeContracts(getAccount().contracts, session.password)
          setLastUpdate(new Date().getTime())
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
        },
        onError: (err) => {
          error('Could not fetch contract information')
          updateMessage({
            msgKey: err.error || 'error.general',
            level: 'ERROR',
          })
        },
      }),
      [],
    ),
  )

  return (
    <PeachScrollView contentContainerStyle={tw`px-12`}>
      <View style={tw`pt-5 pb-10`}>
        <Title title={i18n('yourTrades.title')} />
        {allOpenOffers.length + pastOffers.length === 0 ? (
          <Text style={tw`text-center`}>{i18n('yourTrades.noOffers')}</Text>
        ) : null}
        {openOffers.buy.length ? (
          <Headline style={tw`mt-20 text-grey-1`}>
            {i18n('yourTrades.open')}
            <Headline style={tw`text-green`}> {i18n('yourTrades.buy')} </Headline>
            {i18n('yourTrades.offers')}
          </Headline>
        ) : null}
        {openOffers.buy.map((offer) => (
          <OfferItem key={offer.id} style={tw`mt-3`} extended={true} offer={offer} navigation={navigation} />
        ))}
        {openOffers.sell.length ? (
          <Headline style={tw`mt-20 text-grey-1`}>
            {i18n('yourTrades.open')}
            <Headline style={tw`text-red`}> {i18n('yourTrades.sell')} </Headline>
            {i18n('yourTrades.offers')}
          </Headline>
        ) : null}
        {openOffers.sell.map((offer) => (
          <OfferItem key={offer.id} style={tw`mt-3`} extended={true} offer={offer} navigation={navigation} />
        ))}
        {pastOffers.length ? <Headline style={tw`mt-20 text-grey-1`}>{i18n('yourTrades.pastOffers')}</Headline> : null}
        {pastOffers.map((offer) => (
          <OfferItem key={offer.id} extended={false} style={tw`mt-3`} offer={offer} navigation={navigation} />
        ))}
      </View>
    </PeachScrollView>
  )
}
