import React, { ReactElement, useContext, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import {  Button,
  SatsFormat,
  Text,
} from '../../components'
import BitcoinContext from '../../components/bitcoin'
import i18n from '../../utils/i18n'
import { BUCKETS, CURRENCIES } from '../../constants'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'componentsTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  return <ScrollView>
    <View style={tw`pb-32 flex-col justify-center h-full px-4`}>
      <Text style={tw`font-baloo text-xl text-center mt-8`}>
        Sats Format
      </Text>
      {BUCKETS.map(value => <SatsFormat key={value} sats={value} format="big" />)}
      <View style={tw`mt-4`}>
        <Button
          secondary={true}
          onPress={() => navigation.goBack()}
          title="Back"
        />
      </View>
    </View>
  </ScrollView>
}