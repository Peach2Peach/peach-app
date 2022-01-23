import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
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
import Escrow from './Escrow'
import { BUCKETMAP, BUCKETS } from '../../constants'
import { postOffer } from '../../utils/peachAPI'
import { saveOffer } from '../../utils/accountUtils'
import { RouteProp } from '@react-navigation/native'
import { MessageContext } from '../../utils/messageUtils'
import { error } from '../../utils/logUtils'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'>

type Props = {
  route: RouteProp<{ params: { offer: SellOffer } }>,
  navigation: ProfileScreenNavigationProp,
}
type HeadProps = {
  subtitle?: string|null
}
type NavigationProps = {
  screen: string,
  back: () => void,
  next: () => void,
  stepValid: boolean
}

export type SellViewProps = {
  offer: SellOffer,
  updateOffer: (data: SellOffer) => void,
  setStepValid: (isValid: boolean) => void,
}

const defaultOffer: SellOffer = {
  type: 'ask',
  premium: 1.5,
  currencies: [],
  paymentData: [],
  amount: BUCKETS[0],
  kyc: false
}
type Screen = ({ offer, updateOffer }: SellViewProps) => ReactElement

const screens = [
  {
    id: 'main',
    view: Main,
    subtitle: 'sell.subtitle',
    scrollable: false
  },
  {
    id: 'offerDetails',
    view: OfferDetails,
    subtitle: null,
    scrollable: true
  },
  {
    id: 'summary',
    view: Summary,
    subtitle: 'sell.summary.subtitle',
    scrollable: false
  },
  {
    id: 'escrow',
    view: Escrow,
    subtitle: 'sell.escrow.subtitle',
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

const Navigation = ({ screen, back, next, stepValid }: NavigationProps): ReactElement =>
  <View style={tw`mb-8 w-full flex items-center`}>
    {!/main|escrow/u.test(screen)
      ? <Pressable style={tw`absolute left-0 z-10`} onPress={back}>
        <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
      </Pressable>
      : null
    }
    <Button
      style={!stepValid ? tw`opacity-50` : {}}
      wide={false}
      onPress={stepValid ? next : () => {}}
      title={i18n('next')}
    />
  </View>

export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)
  const [, updateMessage] = useContext(MessageContext)

  const [offer, setOffer] = useState<SellOffer>(route.params?.offer || defaultOffer)
  const [stepValid, setStepValid] = useState(false)

  const [page, setPage] = useState(offer.offerId ? screens.findIndex(s => s.id === 'escrow') : 0)
  const currentScreen = screens[page]
  const CurrentView: Screen = currentScreen.view
  const { subtitle, scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const next = async (): Promise<void> => {
    if (screens[page + 1].id === 'escrow') {
      const [result, err] = await postOffer({
        ...offer,
        amount: BUCKETMAP[String(offer.amount)],
        paymentMethods: offer.paymentData.map(p => p.type),
      })

      if (result) {
        saveOffer({ ...offer, offerId: result.offerId })
        setOffer({ ...offer, offerId: result.offerId })
      } else {
        error('Error', err)
        updateMessage({
          msg: i18n('error.postOffer'),
          level: 'ERROR',
        })
        return
      }
    }
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
          <Head subtitle={subtitle}/>
          {CurrentView
            ? <CurrentView offer={offer} updateOffer={setOffer} setStepValid={setStepValid} />
            : null
          }
        </View>
        {scrollable
          ? <Navigation screen={currentScreen.id} back={back} next={next} stepValid={stepValid} />
          : null
        }
      </ScrollView>
    </View>
    {!scrollable
      ? <Navigation screen={currentScreen.id} back={back} next={next} stepValid={stepValid} />
      : null
    }
  </View>
}
