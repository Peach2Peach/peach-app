import React, { ReactElement, useContext, useRef, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Text } from '../../components'
import Icon from '../../components/Icon'
import BitcoinContext from '../../components/bitcoin'
import i18n from '../../utils/i18n'
import Main from './Main'
import OfferDetails from './OfferDetails'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'>

type Props = {
  navigation: ProfileScreenNavigationProp
}
type HeadProps = {
  showSubtitle: boolean
}
type NavigationProps = {
  back: () => void,
  next: () => void,
}

type Screen = () => ReactElement


const screens = [
  Main,
  OfferDetails,
]

export const Head = ({ showSubtitle }: HeadProps): ReactElement => <View style={tw`flex items-center`}>
  <Image source={require('../../../assets/favico/peach-logo.png')} style={tw`w-12 h-12`}/>
  <Text style={tw`font-baloo text-center text-4xl leading-5xl text-peach-1 mt-3`}>
    {i18n('sell.title')}
  </Text>
  {showSubtitle
    ? <Text style={tw`text-center leading-6 text-grey-2 -m-4`}>
      {i18n('sell.subtitle')}
    </Text>
    : null
  }
</View>

const Navigation = ({ back, next }: NavigationProps): ReactElement => <View style={tw`mb-8 w-full flex items-center`}>
  <Pressable style={tw`absolute left-0 z-10`} onPress={back}>
    <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
  </Pressable>
  <Button
    wide={false}
    onPress={next}
    title={i18n('next')}
  />
</View>

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const [page, setPage] = useState(0)
  const CurrentScreen: Screen = screens[page]
  const scroll = useRef<ScrollView>(null)

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)
    scroll.current?.scrollTo({ x: 0 })
  }
  const back = () => {
    if (page === 0) return
    setPage(page - 1)
    scroll.current?.scrollTo({ x: 0 })
  }

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <ScrollView ref={scroll} style={tw`pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
          <Head showSubtitle={page === 0}/>
          <CurrentScreen />
        </View>
        {page !== 0
          ? <Navigation back={back} next={next} />
          : null
        }
      </ScrollView>
    </View>
    {page === 0
      ? <Navigation back={back} next={next} />
      : null
    }
  </View>
}