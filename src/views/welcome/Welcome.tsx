import { useRef, useState } from 'react'
import { TouchableOpacity, View, useWindowDimensions } from 'react-native'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { Header, Icon, Progress, Screen, Text } from '../../components'
import { HeaderIcon } from '../../components/Header'
import { Button } from '../../components/buttons/Button'
import { useDrawerState } from '../../components/drawer/useDrawerState'
import { useKeyboard, useNavigation } from '../../hooks'
import { useLanguage } from '../../hooks/useLanguage'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { AWalletYouControl } from './AWalletYouControl'
import { LetsGetStarted } from './LetsGetStarted'
import { PeachOfMind } from './PeachOfMind'
import { PeerToPeer } from './PeerToPeer'
import { PrivacyFirst } from './PrivacyFirst'

export const screens = [PeerToPeer, PeachOfMind, PrivacyFirst, AWalletYouControl, LetsGetStarted]

export const Welcome = () => {
  const { width } = useWindowDimensions()
  const $carousel = useRef<ICarouselInstance>(null)
  const [page, setPage] = useState(0)

  const next = () => {
    $carousel.current?.next()
    setPage((p) => p + 1)
  }
  const goToEnd = () => {
    $carousel.current?.next({ count: screens.length - 1 - page })
    setPage(screens.length - 1)
  }
  const progress = (page + 1) / screens.length
  const endReached = progress === 1
  const keyboardOpen = useKeyboard()

  return (
    <Screen header={<OnboardingHeader />} gradientBackground>
      <Progress
        percent={progress}
        backgroundStyle={tw`opacity-50 bg-primary-background-light`}
        barStyle={tw`bg-primary-background-light`}
        style={tw`h-2`}
      />
      <TouchableOpacity
        onPress={goToEnd}
        style={[tw`flex-row items-center self-end h-8 gap-1`, endReached && tw`opacity-0`]}
      >
        <Text style={tw`text-primary-background-light`}>{i18n('skip')}</Text>
        <Icon id="skipForward" size={12} color={tw`text-primary-background-light`.color} />
      </TouchableOpacity>
      <View style={tw`items-center h-full shrink`}>
        <Carousel
          ref={$carousel}
          data={screens}
          snapEnabled={true}
          loop={false}
          width={width}
          onSnapToItem={setPage}
          renderItem={({ item: Item }) => (
            <View onStartShouldSetResponder={() => !keyboardOpen} style={tw`h-full px-6`}>
              <Item />
            </View>
          )}
        />
      </View>
      {!keyboardOpen && (
        <Button
          style={[tw`self-center bg-primary-background-light`, page === screens.length - 1 && tw`opacity-0`]}
          textColor={tw`text-primary-main`}
          onPress={next}
          iconId="arrowRightCircle"
        >
          {i18n('next')}
        </Button>
      )}
    </Screen>
  )
}

function OnboardingHeader () {
  const navigation = useNavigation()
  const updateDrawer = useDrawerState((state) => state.updateDrawer)
  const { locale, updateLocale } = useLanguage()

  const openLanguageDrawer = () => {
    updateDrawer({
      title: i18n('language.select'),
      options: i18n.getLocales().map((l) => ({
        title: i18n(`languageName.${l}`),
        onPress: () => {
          updateLocale(l)
          updateDrawer({ show: false })
        },
        iconRightID: l === locale ? 'check' : undefined,
      })),
      show: true,
    })
  }
  const headerIcons: HeaderIcon[] = [
    { id: 'mail', color: tw`text-primary-background-light`.color, onPress: () => navigation.navigate('contact') },
    { id: 'globe', color: tw`text-primary-background-light`.color, onPress: openLanguageDrawer },
  ]
  return <Header title={i18n('welcome.welcomeToPeach.title')} icons={headerIcons} theme="transparent" hideGoBackButton />
}
