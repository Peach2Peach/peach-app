import React, { ReactElement, useContext } from 'react'
import {
  Image,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import i18n from '../../utils/i18n'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Headline, PeachScrollView, Text } from '../../components'
import BitcoinContext, { getBitcoinContext } from '../../utils/bitcoin'
import { thousands } from '../../utils/string'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const { currency, price, satsPerUnit } = getBitcoinContext()

  return <PeachScrollView>
    <View style={tw`pt-12 pb-32 flex-col justify-center items-center h-full`}>
      <Image source={require('../../../assets/favico/peach-icon-192.png')}
        style={[tw`h-12`, { resizeMode: 'contain' }]}/>
      <Headline style={tw`text-3xl leading-3xl`}>
        {i18n('welcome.welcomeToPeach.title')}
      </Headline>
      <View style={tw`w-full flex-row mt-10`}>
        <Text style={tw`font-baloo text-lg`}>
          {i18n('home.currentPrice')}:
        </Text>
        <Text style={tw`ml-4 font-baloo text-lg text-peach-1`}>
          {i18n(`currency.format.${currency}`, thousands(Math.round(price)))}
        </Text>
      </View>
      <View style={tw`w-full flex-row`}>
        <Text style={tw`font-baloo text-lg`}>
          1 {currency}:
        </Text>
        <Text style={tw`ml-4 font-baloo text-lg text-peach-1`}>
          {i18n('currency.format.sats', String(Math.round(satsPerUnit)))}
        </Text>
      </View>
    </View>
  </PeachScrollView>
}