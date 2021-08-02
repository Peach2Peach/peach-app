import React from 'react'
import {
  Button,
  Text,
  View
} from 'react-native'
import FadeInView from '../../components/animation/FadeInView'
import tw from '../../styles/tailwind'

export default ({ navigation }) => <View style={tw`flex-col justify-center h-full`}>
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
</View>