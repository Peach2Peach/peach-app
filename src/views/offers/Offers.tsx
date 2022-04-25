import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  Pressable,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { PeachScrollView, Text } from '../../components'
import { account, getAccount, saveAccount } from '../../utils/account'
import { getContract } from '../../utils/contract'
import { MessageContext } from '../../contexts/message'
import { error } from '../../utils/log'
import getOffersEffect from '../../effects/getOffersEffect'
import i18n from '../../utils/i18n'
import { saveOffer } from '../../utils/offer'
import { session } from '../../utils/session'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

const navigateToOffer = (offer: SellOffer|BuyOffer, navigation: ProfileScreenNavigationProp): void => {
  if (offer.type === 'ask' && offer.funding && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)) {
    return navigation.navigate('refund', { offer })
  }

  if (offer.contractId) {
    const contract = getContract(offer.contractId)
    if (contract) {
      const view = account.publicKey === contract.seller.id ? 'seller' : 'buyer'
      if ((view === 'seller' && contract.ratingBuyer)
        || (view === 'buyer' && contract.ratingSeller)) {
        return navigation.navigate('tradeComplete', { view, contract })
      }
    }
    return navigation.navigate('contract', { contractId: offer.contractId })
  }

  if (offer.type === 'ask') {
    if (offer.published && offer.confirmedReturnAddress && offer.funding?.status === 'FUNDED') {
      return navigation.navigate('search', { offer })
    }
    return navigation.navigate('sell', { offer })
  }

  if (offer.type === 'bid') {
    if (offer.published) {
      return navigation.navigate('search', { offer })
    }
    return navigation.navigate('buy', { offer })
  }

  return navigation.navigate('offers', {})
}

// TODO check offer status (escrow, searching, matched, online/offline, contractId, what else?)
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const [offers, setOffers] = useState(account.offers)

  useEffect(getOffersEffect({
    onSuccess: result => {
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
    <View style={tw`pb-32`}>
      <View>
        <Text style={tw`font-lato-bold text-center text-5xl leading-5xl text-gray-700`}>
          Offers
        </Text>
      </View>
      {offers.map(offer => <View key={offer.id}>
        <Pressable onPress={() => navigateToOffer(offer, navigation)}>
          <Text style={!offer.online ? tw`opacity-50` : {}}>
            {offer.id} - {offer.type} - {offer.amount} - {offer.contractId ? getContract(offer.contractId)?.id : null}
          </Text>
        </Pressable>
      </View>)}
    </View>
  </PeachScrollView>
}