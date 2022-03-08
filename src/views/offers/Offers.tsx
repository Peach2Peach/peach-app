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
        <Pressable onPress={() => offer.contractId
          ? navigation.navigate('contract', { contractId: offer.contractId })
          : offer.published
            && (offer.type === 'bid' || (offer.funding?.status === 'FUNDED' && offer.confirmedReturnAddress))
            ? navigation.navigate('search', { offer })
            : offer.type === 'ask'
              ? navigation.navigate('sell', { offer })
              : navigation.navigate('buy', { offer })
        }>
          <Text style={!offer.online ? tw`opacity-50` : {}}>
            {offer.id} - {offer.type} - {offer.amount} - {offer.contractId ? getContract(offer.contractId)?.id : null}
          </Text>
        </Pressable>
      </View>)}
    </View>
  </ScrollView>
}