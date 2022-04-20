import React, { ReactElement, useContext, useReducer, useState } from 'react'
import {
  Image,
  Pressable,
  View
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Button, LanguageSelect } from '../../components'
import i18n from '../../utils/i18n'
import WelcomeToPeach from './WelcomeToPeach'
import YouOwnYourData from './YouOwnYourData'
import PeachOfMind from './PeachOfMind'
import LetsGetStarted from './LetsGetStarted'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'welcome'>

type ScreenProps = {
  navigation: ProfileScreenNavigationProp;
}

type Screen = (props: ScreenProps) => ReactElement


const screens = [
  WelcomeToPeach,
  PeachOfMind,
  YouOwnYourData,
  LetsGetStarted,
]

export default ({ navigation }: ScreenProps): ReactElement => {
  useContext(LanguageContext)
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: 'en' })

  const [page, setPage] = useState(0)
  const CurrentScreen: Screen = screens[page]

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)
  }
  const goTo = (p: number) => {
    setPage(p)
  }

  return <View style={tw`h-full flex px-6`}>
    <View style={tw`absolute top-10 right-4 z-20`}>
      <LanguageSelect locale={locale} setLocale={setLocale} />
    </View>
    <View style={[
      tw`h-full flex-shrink p-6 pt-32 flex-col items-center`,
      tw.md`pt-40`
    ]}>
      <Image source={require('../../../assets/favico/peach-logo.png')}
        style={[tw`h-24`, tw.md`h-32`, { resizeMode: 'contain' }]}
      />
      <View style={[tw`mt-11 w-full`, tw.md`mt-16`]}>
        <CurrentScreen navigation={navigation} />
      </View>
    </View>
    <View style={[
      tw`mb-10 mt-4 flex items-center w-full`,
      tw.md`mb-16`
    ]}>
      {page !== screens.length - 1
        ? <Button
          title={i18n('next')}
          wide={false}
          onPress={next}
        />
        : <View>
          <View style={tw`flex items-center`}>
            <Button
              onPress={() => navigation.navigate('newUser')}
              wide={false}
              title={i18n('newUser')}
            />
          </View>
          <View style={tw`mt-4`}>
            <Button
              onPress={() => navigation.navigate('restoreBackup')}
              wide={false}
              secondary={true}
              title={i18n('restoreBackup')}
            />
          </View>
        </View>
      }
      <View style={tw`w-full flex-row justify-center mt-11`}>
        {screens.map((screen, i) =>
          <Pressable key={i} onPress={() => goTo(i)}
            style={[
              tw`w-4 h-4 mx-2 rounded-full bg-peach-1`,
              i !== page ? tw`opacity-30` : {}
            ]}/>
        )}
      </View>
    </View>
  </View>
}