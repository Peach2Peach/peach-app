import React, { ReactElement, useContext } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Text } from '../../components'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'buy'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  return <ScrollView style={tw`mb-20`}>
    <View style={tw`flex-col justify-center h-full`}>
      <Text style={tw`font-lato-bold text-center text-5xl leading-5xl text-gray-700`}>
        Buy
      </Text>
    </View>
    <View style={tw`mt-4`}>
      <Button
        secondary={true}
        onPress={() => navigation.goBack()}
        title="Back"
      />
    </View>
  </ScrollView>
}