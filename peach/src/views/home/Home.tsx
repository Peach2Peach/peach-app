import React, { ReactElement, useContext } from 'react'
import {
  Button,
  Text,
  View
} from 'react-native'
import FadeInView from '../../components/animation/FadeInView'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import i18n from '../../utils/i18n'
import LanguageContext from '../../components/inputs/LanguageSelect'

type RootStackParamList = {
  Home: undefined,
  AccountTest: undefined,
  InputTest: undefined
}

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  return <View style={tw`flex-col justify-center h-full`}>
    <FadeInView duration={400} delay={500}>
      <Text style={tw`font-sans text-center text-8xl`}>
        🍑
      </Text>
    </FadeInView>
    <FadeInView duration={400} delay={600}>
      <Text style={tw`font-sans-bold text-center text-5xl text-gray-700`}>
        Peach
      </Text>
    </FadeInView>
    <FadeInView duration={400} delay={700}>
      <Text style={[tw`font-sans-light text-center text-4xl font-thin text-gray-700`, tw.md`text-5xl`]}>
        meet <Text style={tw`text-orange`}>satoshi's</Text> world
      </Text>
    </FadeInView>
    <View style={tw`mt-4`}>
      <Button onPress={() => navigation.navigate('AccountTest')} title="Account Tests"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => navigation.navigate('InputTest')} title="Input Tests"/>
    </View>
    <Text style={tw`mt-4`}>
      {i18n('i18n.explainer')}
    </Text>
  </View>
}