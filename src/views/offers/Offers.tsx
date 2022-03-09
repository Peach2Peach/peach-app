import React, { ReactElement, useContext } from 'react'
import {
  Pressable,
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import { account } from '../../utils/account'
import { getContract } from '../../utils/contract'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'offers'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

const navigateToOffer = (offer: SellOffer|BuyOffer, navigation: ProfileScreenNavigationProp): void => {
  if (offer.type === 'ask' && offer.funding && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)) {
    return navigation.navigate('refund', { offer })
  }

  if (offer.contractId) {
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

  return <ScrollView>
    <View style={tw`pb-32`}>
      <View>
        <Text style={tw`font-lato-bold text-center text-5xl leading-5xl text-gray-700`}>
          Offers
        </Text>
      </View>
      {account.offers.map(offer => <View key={offer.id}>
        <Pressable onPress={() => navigateToOffer(offer, navigation)}>
          <Text style={!offer.online ? tw`opacity-50` : {}}>
            {offer.id} - {offer.type} - {offer.amount} - {offer.contractId ? getContract(offer.contractId)?.id : null}
          </Text>
        </Pressable>
      </View>)}
    </View>
  </ScrollView>
}