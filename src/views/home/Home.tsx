import React, { ReactElement, useContext } from 'react'
import {
  Image,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import i18n from '../../utils/i18n'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { PeachScrollView } from '../../components'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  return <PeachScrollView>
    <View style={tw`pt-12 pb-32 flex-col justify-center items-center h-full`}>
      <Image source={require('../../../assets/favico/peach-icon-192.png')}
        style={[tw`h-12`, { resizeMode: 'contain' }]}/>
    </View>
  </PeachScrollView>
}