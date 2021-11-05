import React, { ReactElement, useContext, useReducer, useRef, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native'
const { LinearGradient } = require('react-native-gradients')
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, LanguageSelect, Text } from '../../components'
import i18n from '../../utils/i18n'
import WelcomeToPeach from './WelcomeToPeach'
import YouOwnYourData from './YouOwnYourData'
import PeachOfMind from './PeachOfMind'

const screens = [
  WelcomeToPeach,
  YouOwnYourData,
  PeachOfMind,
]

const gradient = [
  { offset: '0%', color: '#FFF', opacity: '1' },
  { offset: '100%', color: '#FFF', opacity: '0' }
]

// eslint-disable-next-line max-lines-per-function
export default (): ReactElement => {
  const { locale } = useContext(LanguageContext)
  const [page, setPage] = useState(0)
  const CurrentScreen = screens[page]
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
    <View style={tw`h-full flex-shrink px-8`}>
      <View style={tw`absolute top-10 right-4 z-10`}>
        <LanguageSelect locale={locale}/>
      </View>
      <View style={tw`w-full h-10 mt-32 -mb-10 z-10`}>
        <LinearGradient colorList={gradient} angle={-90} />
      </View>
      <ScrollView style={tw``} ref={scroll}>
        <View style={tw`pb-10`}>
          <View style={tw`flex items-center`}>
            <Image source={require('../../../assets/favico/peach-icon-192.png')} />
          </View>
          <CurrentScreen />
        </View>
      </ScrollView>
      <View style={tw`w-full h-10 -mt-10`}>
        <LinearGradient colorList={gradient} angle={90} />
      </View>
    </View>
    <View style={tw`mb-8 w-full`}>
      <View style={tw`mt-4 flex items-center`}>
        <Button
          title={i18n('next')}
          wide={false}
          onPress={next}
        />
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