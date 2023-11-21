import { Image, useWindowDimensions, View } from 'react-native'
import aWalletYouControl from '../../assets/onboarding/a-wallet-you-control.png'
import peachOfMind from '../../assets/onboarding/peach-of-mind.png'
import peerToPeer from '../../assets/onboarding/peer-to-peer.png'
import privacyFirst from '../../assets/onboarding/privacy-first.png'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

const images = { peachOfMind, peerToPeer, privacyFirst, aWalletYouControl }
const ASPECT_RATIO = 0.7
export const WelcomeInfo = ({ name }: { name: 'peachOfMind' | 'peerToPeer' | 'privacyFirst' | 'aWalletYouControl' }) => {
  const { width } = useWindowDimensions()

  return (
    <View style={[tw`items-center justify-center h-full px-sm`, tw.md`px-md`]}>
      <Text style={tw`text-center h5 text-primary-background-light`}>{i18n(`welcome.${name}.title`)}</Text>
      <Text style={tw`mt-4 text-center text-primary-background-light`}>{i18n(`welcome.${name}.description`)}</Text>
      <Image source={images[name]} style={{ width, height: width * ASPECT_RATIO }} resizeMode="contain" />
    </View>
  )
}
