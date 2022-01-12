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
import Summary from './Summary'
import { BUCKETS } from '../../constants'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'>

type Props = {
  navigation: ProfileScreenNavigationProp
}
type HeadProps = {
  subtitle?: string|null
}
type NavigationProps = {
  back: () => void,
  next: () => void,
  stepValid: boolean
}

export type SellViewProps = {
  offer: SellOffer,
  updateOffer: (data: SellOffer) => void,
  setStepValid: (isValid: boolean) => void,
}

type Screen = ({ offer, updateOffer }: SellViewProps) => ReactElement

const screens = [
  {
    view: Main,
    subtitle: 'sell.subtitle',
    scrollable: false
  },
  {
    view: OfferDetails,
    subtitle: null,
    scrollable: true
  },
  {
    view: Summary,
    subtitle: 'sell.summary. subtitle',
    scrollable: false
  },
]

export const Head = ({ subtitle }: HeadProps): ReactElement => <View style={tw`flex items-center`}>
  <Image source={require('../../../assets/favico/peach-logo.png')} style={tw`w-12 h-12`}/>
  <Text style={tw`font-baloo text-center text-4xl leading-5xl text-peach-1 mt-3`}>
    {i18n('sell.title')}
  </Text>
  {subtitle
    ? <Text style={tw`text-center leading-6 text-grey-2 -mt-4`}>
      {i18n(subtitle)}
    </Text>
    : null
  }
</View>

const Navigation = ({ back, next, stepValid }: NavigationProps): ReactElement =>
  <View style={tw`mb-8 w-full flex items-center`}>
    <Pressable style={tw`absolute left-0 z-10`} onPress={back}>
      <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
    </Pressable>
    <Button
      style={!stepValid ? tw`opacity-50` : {}}
      wide={false}
      onPress={stepValid ? next : () => {}}
      title={i18n('next')}
    />
  </View>

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const [offer, setOffer] = useState<SellOffer>({
    type: 'ask',
    premium: 1.5,
    currencies: [],
    paymentMethods: [],
    amount: BUCKETS[0],
    kyc: false
  })
  const [stepValid, setStepValid] = useState(false)

  const [page, setPage] = useState(0)
  const CurrentScreen: Screen = screens[page].view
  const { subtitle, scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const next = () => {
    if (page >= screens.length - 1) return
    setPage(page + 1)

    console.log(offer)
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
          <Head subtitle={subtitle}/>
          <CurrentScreen offer={offer} updateOffer={setOffer} setStepValid={setStepValid} />
        </View>
        {scrollable
          ? <Navigation back={back} next={next} stepValid={stepValid} />
          : null
        }
      </ScrollView>
    </View>
    {!scrollable
      ? <Navigation back={back} next={next} stepValid={stepValid} />
      : null
    }
  </View>
}
