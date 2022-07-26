import React, { ReactElement, useContext } from 'react'
import {
  Image,
  View
} from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, PeachScrollView, Text } from '../../components'
import BitcoinContext from '../../contexts/bitcoin'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { Navigation } from '../../utils/navigation'
import { thousands } from '../../utils/string'

type Props = {
  navigation: Navigation
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [{ currency, price, satsPerUnit }] = useContext(BitcoinContext)

  return <PeachScrollView>
    <View style={tw`pt-12 pb-32 flex-col justify-center items-center h-full px-6`}>
      <Image source={require('../../../assets/favico/peach-logo.png')}
        style={[tw`h-12`, { resizeMode: 'contain' }]}/>
      <Headline style={tw`text-3xl leading-3xl mt-4`}>
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