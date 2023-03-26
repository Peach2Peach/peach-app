import { useContext } from 'react';
import { Image, useWindowDimensions, View } from 'react-native'
import { Text } from '../../components'
import LanguageContext from '../../contexts/language'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import peachOfMind from '../../assets/onboarding/peach-of-mind.png'
import peerToPeer from '../../assets/onboarding/peer-to-peer.png'
import privacyFirst from '../../assets/onboarding/privacy-first.png'
import aWalletYouControl from '../../assets/onboarding/a-wallet-you-control.png'

const images = { peachOfMind, peerToPeer, privacyFirst, aWalletYouControl }
export default ({ name }: { name: 'peachOfMind' | 'peerToPeer' | 'privacyFirst' | 'aWalletYouControl' }) => {
  useContext(LanguageContext)
  const { width } = useWindowDimensions()

  return (
    <View style={tw`flex flex-col items-center justify-center h-full`}>
      <Text style={tw`text-center h5 text-primary-background-light`}>{i18n(`welcome.${name}.title`)}</Text>
      <Text style={tw`mt-4 text-center text-primary-background-light`}>{i18n(`welcome.${name}.description`)}</Text>
      <Image source={images[name]} style={{ width, height: width * 0.7 }} resizeMode="contain" />
    </View>
  )
}
