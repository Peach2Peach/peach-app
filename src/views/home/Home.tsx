import React, { ReactElement, useContext } from 'react'
import {
  Image,
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import i18n from '../../utils/i18n'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Text, FadeInView } from '../../components'
import peachLogo from '../../../assets/favico/peach-icon-192.png'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  return <ScrollView style={tw`mb-20`}>
    <View style={tw`flex-col justify-center h-full`}>
      <FadeInView duration={400} delay={500} style={tw`flex items-center`} >
        <Image source={peachLogo}/>
      </FadeInView>
      <FadeInView duration={400} delay={600}>
        <Text style={tw`font-lato-bold text-center text-5xl leading-5xl text-gray-700`}>
          Peach
        </Text>
      </FadeInView>
      <FadeInView duration={400} delay={700}>
        <Text style={[tw`text-center text-4xl leading-4xl text-gray-700`, tw.md`text-5xl`]}>
          meet <Text style={tw`text-4xl leading-4xl text-peach-1`}>satoshi's</Text> world
        </Text>
      </FadeInView>
      <View style={tw`mt-4 flex items-center`}>
        <Button
          title="Components"
          wide={false}
          onPress={() => navigation.navigate('ComponentsTest')}
        />
      </View>
      <View style={tw`mt-4 flex items-center`}>
        <Button
          title="Account Tests"
          wide={false}
          onPress={() => navigation.navigate('AccountTest')}
        />
      </View>
      <View style={tw`mt-4 flex items-center`}>
        <Button
          title="Input Tests"
          wide={false}
          onPress={() => navigation.navigate('InputTest')}
        />
      </View>
      <View style={tw`mt-4 flex items-center`}>
        <Button
          title="PGP Tests"
          wide={false}
          onPress={() => navigation.navigate('PGPTest')}
        />
      </View>
      <Text style={tw`mt-4`}>
        {i18n('i18n.explainer')}
      </Text>
    </View>
  </ScrollView>
}