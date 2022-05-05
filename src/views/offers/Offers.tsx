import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Headline, PeachScrollView, Text, Title } from '../../components'
import { account, getAccount, saveAccount } from '../../utils/account'
import { MessageContext } from '../../contexts/message'
import { error } from '../../utils/log'
import getOffersEffect from '../../effects/getOffersEffect'
import i18n from '../../utils/i18n'
import { getOffers, getOfferStatus, saveOffer } from '../../utils/offer'
import { session } from '../../utils/session'
import { OfferItem } from './components/OfferItem'
import { saveContract } from '../../utils/contract'
import getContractsEffect from '../../effects/getContractsEffect'

export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'offers'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

const isPastOffer = (offer: SellOffer|BuyOffer) => {
  const { status } = getOfferStatus(offer)

  return /tradeCompleted|tradeCanceled|offerCanceled/u.test(status)
}

const isOpenOffer = (offer: SellOffer|BuyOffer) => !isPastOffer(offer)

const showOffer = (offer: SellOffer|BuyOffer) => offer.online || offer.contractId || offer.type === 'ask'

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [lastUpdate, setLastUpdate] = useState(new Date().getTime())
  const offers = getOffers()
  const allOpenOffers = offers
    .filter(isOpenOffer)
    .filter(showOffer)
  const openOffers = {
    buy: allOpenOffers.filter(o => o.type === 'bid'),
    sell: allOpenOffers.filter(o => o.type === 'ask'),
  }
  const pastOffers = offers.filter(isPastOffer).filter(showOffer)

  useEffect(getOffersEffect({
    onSuccess: result => {
      if (!result?.length) return
      result.map(offer => saveOffer(offer, true))
      if (session.password) saveAccount(getAccount(), session.password)
      setLastUpdate(new Date().getTime())
    },
    onError: err => {
      error('Could not fetch offer information')
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [])

  useEffect(getContractsEffect({
    onSuccess: result => {
      if (!result?.length) return
      result.map(contract => saveContract(contract, true))
      if (session.password) saveAccount(getAccount(), session.password)
      setLastUpdate(new Date().getTime())
    },
    onError: err => {
      error('Could not fetch contract information')
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [])

  return <PeachScrollView contentContainerStyle={tw`px-6`}>
    <View style={tw`pt-5 pb-10 px-11`}>
      <Title title={i18n('offers.title')}/>
      {allOpenOffers.length + pastOffers.length === 0
        ? <Text style={tw`text-center`}>
          {i18n('offers.noOffers')}
        </Text>
        : null
      }
      {openOffers.buy.length
        ? <Headline style={tw`mt-20 text-grey-1`}>
          {i18n('offers.open')}
          <Headline style={tw`text-green`}> {i18n('offers.buy')} </Headline>
          {i18n('offers.offers')}
        </Headline>
        : null
      }
      {openOffers.buy.map(offer => <OfferItem key={offer.id}
        style={tw`mt-3`} showType={false}
        offer={offer} navigation={navigation}
      />)
      }
      {openOffers.sell.length
        ? <Headline style={tw`mt-20 text-grey-1`}>
          {i18n('offers.open')}
          <Headline style={tw`text-red`}> {i18n('offers.sell')} </Headline>
          {i18n('offers.offers')}
        </Headline>
        : null
      }
      {openOffers.sell.map(offer => <OfferItem key={offer.id}
        style={tw`mt-3`} showType={false}
        offer={offer} navigation={navigation}
      />)
      }
      {pastOffers.length
        ? <Headline style={tw`mt-20 text-grey-1`}>
          {i18n('offers.pastOffers')}
        </Headline>
        : null
      }
      {pastOffers.map(offer => <OfferItem key={offer.id}
        style={tw`mt-3`}
        offer={offer} navigation={navigation}
      />)
      }
    </View>
  </PeachScrollView>
}