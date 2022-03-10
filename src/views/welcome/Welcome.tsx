import React, { ReactElement, useContext, useReducer, useRef, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
const { LinearGradient } = require('react-native-gradients')
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button } from '../../components'
import i18n from '../../utils/i18n'
import WelcomeToPeach from './WelcomeToPeach'
import YouOwnYourData from './YouOwnYourData'
import PeachOfMind from './PeachOfMind'
import LetsGetStarted from './LetsGetStarted'
import { whiteGradient } from '../../utils/layout'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'welcome'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

type Screen = (props: Props) => ReactElement


const screens = [
  WelcomeToPeach,
  YouOwnYourData,
  PeachOfMind,
  LetsGetStarted,
]

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: 'en' })

  useContext(LanguageContext)

  const [page, setPage] = useState(0)
  const CurrentScreen: Screen = screens[page]
  const scroll = useRef<ScrollView>(null)

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)
    scroll.current?.scrollTo({ x: 0 })
  }
  const goTo = (p: number) => {
    setPage(p)
    scroll.current?.scrollTo({ x: 0 })
  }

  return <View style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`w-full h-8 mt-32 -mb-8 z-10`}>
        <LinearGradient colorList={whiteGradient} angle={-90} />
      </View>
      <ScrollView ref={scroll}>
        <View style={tw`pb-8 px-8`}>
          <View style={tw`flex items-center`}>
            <Image source={require('../../../assets/favico/peach-icon-192.png')} />
          </View>
          <CurrentScreen navigation={navigation} />
        </View>
      </ScrollView>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
    </View>
    <View style={tw`mb-8 w-full`}>
      <View style={tw`mt-4 flex items-center`}>
        {page !== screens.length - 1
          ? <Button
            title={i18n('next')}
            wide={false}
            onPress={next}
          />
          : <View>
            <View style={tw`mt-1 flex items-center`}>
              <Button
                onPress={() => navigation.navigate('newUser')}
                wide={false}
                title={i18n('newUser')}
              />
            </View>
            <View style={tw`mt-4`}>
              <Button
                onPress={() => navigation.navigate('restoreBackup')}
                secondary={true}
                title={i18n('restoreBackup')}
              />
            </View>
          </View>
        }
      </View>
      <View style={tw`w-full flex-row justify-center mt-16`}>
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