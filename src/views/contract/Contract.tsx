import React, { ReactElement, useContext, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import { RouteProp } from '@react-navigation/native'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp;
}

// TODO check offer status (escrow, searching, matched, online/offline, what else?)
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [contract, setContract] = useState<string>(route.params.contractId)

  return <ScrollView>
    <View style={tw`pb-32`}>
      <Text style={tw`font-lato-bold text-center text-5xl leading-5xl text-gray-700`}>
        Contract {JSON.stringify(contract)}
      </Text>
    </View>
  </ScrollView>
}