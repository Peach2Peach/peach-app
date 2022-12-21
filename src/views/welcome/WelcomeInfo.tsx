import React, { useContext } from 'react'
import { Image, useWindowDimensions, View } from 'react-native'
import { Text } from '../../components'
import LanguageContext from '../../contexts/language'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import peachOfMind from '../../assets/onboarding/peach-of-mind.png'
import peerToPeer from '../../assets/onboarding/peer-to-peer.png'
import privacyFirst from '../../assets/onboarding/privacy-first.png'

const images = { peachOfMind, peerToPeer, privacyFirst }
export default ({ name }: { name: 'peachOfMind' | 'peerToPeer' | 'privacyFirst' }) => {
  useContext(LanguageContext)
  const { width } = useWindowDimensions()

  return (
    <View style={tw`h-full flex flex-col justify-center items-center`}>
      <Text style={tw`h5 text-center text-primary-background-light`}>{i18n(`welcome.${name}.title`)}</Text>
      <Text style={tw`mt-4 text-center text-primary-background-light`}>{i18n(`welcome.${name}.description`)}</Text>
      <Image source={images[name]} style={{ width, height: width * 0.7 }} resizeMode="contain" />
    </View>
  )
}
