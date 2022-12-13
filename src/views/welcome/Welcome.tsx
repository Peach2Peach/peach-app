import React, { ReactElement, useMemo, useRef, useState } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import Carousel from 'react-native-snap-carousel'
import Logo from '../../assets/logo/peachLogo.svg'
import { Icon } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { useHeaderSetup } from '../../hooks'
import { useBackgroundSetup } from '../../hooks/useBackgroundSetup'
import i18n from '../../utils/i18n'
import { goToHomepage } from '../../utils/web'
import LetsGetStarted from './LetsGetStarted'
import PeachOfMind from './PeachOfMind'
import Swipe from './Swipe'
import WelcomeToPeach from './WelcomeToPeach'
import YouOwnYourData from './YouOwnYourData'

const onStartShouldSetResponder = () => true

const screens = [WelcomeToPeach, Swipe, PeachOfMind, YouOwnYourData, LetsGetStarted]

const headerIcons = [
  {
    iconComponent: <Icon id="mail" color={tw`text-primary-background-light`.color} />,
    onPress: () => null,
  },
  {
    iconComponent: <Icon id="globe" color={tw`text-primary-background-light`.color} />,
    onPress: goToHomepage,
  },
]

export default (): ReactElement => {
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('welcome.welcomeToPeach.title'),
        hideGoBackButton: true,
        icons: headerIcons,
        theme: 'inverted',
      }),
      [],
    ),
  )
  useBackgroundSetup(
    useMemo(
      () => ({
        color: 'primaryGradient',
      }),
      [],
    ),
  )
  const [{ width }] = useState(() => Dimensions.get('window'))
  const [page, setPage] = useState(0)
  const $carousel = useRef<Carousel<any>>(null)

  const next = () => {
    $carousel.current?.snapToNext()
  }
  const goTo = (p: number) => {
    $carousel.current?.snapToItem(p)
  }

  return (
    <View style={tw`h-full flex`} testID="welcome">
      <View style={tw`h-full flex-shrink flex-col items-center justify-end`}>
        <View style={tw`h-full flex-shrink flex-col items-center justify-end mt-16 pb-10`}>
          <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
        </View>
        <View style={tw`w-full flex-shrink`}>
          <Carousel
            ref={$carousel}
            data={screens}
            enableSnap={true}
            enableMomentum={false}
            sliderWidth={width}
            itemWidth={width}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            inactiveSlideShift={0}
            onBeforeSnapToItem={setPage}
            shouldOptimizeUpdates={true}
            renderItem={({ item: Item }) => (
              <View onStartShouldSetResponder={onStartShouldSetResponder} style={tw`h-full px-6`}>
                <Item />
              </View>
            )}
          />
        </View>
      </View>
      <View style={tw`mb-8 flex items-center w-full`}>
        <View style={page === screens.length - 1 ? tw`opacity-0` : {}}>
          <PrimaryButton testID="welcome-next" narrow onPress={next}>
            {i18n('next')}
          </PrimaryButton>
        </View>
        <View style={tw`w-full flex-row justify-center mt-11`}>
          {screens.map((screen, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              accessibilityLabel={i18n('accessibility.bulletPoint')}
              style={[tw`w-4 h-4 mx-2 rounded-full bg-peach-1`, i !== page ? tw`opacity-30` : {}]}
            />
          ))}
        </View>
      </View>
    </View>
  )
}
