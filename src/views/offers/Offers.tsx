import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Headline, PeachScrollView, Title } from '../../components'
import { account, getAccount, saveAccount } from '../../utils/account'
import { MessageContext } from '../../contexts/message'
import { error } from '../../utils/log'
import getOffersEffect from '../../effects/getOffersEffect'
import i18n from '../../utils/i18n'
import { getOffers, saveOffer } from '../../utils/offer'
import { session } from '../../utils/session'
import { OfferItem } from './components/OfferItem'

export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'offers'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

const showOffer = (offer: SellOffer|BuyOffer) =>
  offer.contractId
  || (offer.type === 'bid' && offer.online)
  || (offer.type === 'ask' && offer.escrow)


export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [offers, setOffers] = useState(getOffers())

  useEffect(getOffersEffect({
    onSuccess: result => {
      if (!result?.length) return
      result.map(offer => saveOffer(offer, true))
      if (session.password) saveAccount(getAccount(), session.password)

      setOffers(account.offers)
    },
    onError: err => {
      error('Could not fetch offer information')
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }), [])

  return <PeachScrollView contentContainerStyle={tw`px-6`}>
    <View style={tw`pb-10 px-10`}>
      <Title title={i18n('offers.title')}/>
      <Headline style={tw`mt-20 text-grey-1`}>
        {i18n('offers.openOffers')}
      </Headline>
      {offers
        .filter(showOffer)
        .map(offer => <OfferItem key={offer.id}
          style={tw`mt-3`}
          offer={offer} navigation={navigation}
        />)
      }
    </View>
  </PeachScrollView>
}