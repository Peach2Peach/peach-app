import React, { ReactElement, useContext } from 'react'
import { Image, useWindowDimensions, View } from 'react-native'
import banner from '../../assets/onboarding/privacy-first.png'
import { Text } from '../../components'
import LanguageContext from '../../contexts/language'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  useContext(LanguageContext)
  const { width } = useWindowDimensions()

  return (
    <View style={tw`h-full flex flex-col justify-center items-center`}>
      <Text style={tw`h5 text-center text-primary-background-light`}>{i18n('welcome.privacyFirst.title')}</Text>
      <Text style={tw`mt-4 text-center text-primary-background-light`}>{i18n('welcome.privacyFirst.description')}</Text>
      <Image source={banner} style={{ width, height: width * 0.7 }} resizeMode="contain" />
    </View>
  )
}
