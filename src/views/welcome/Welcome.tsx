import React, { ReactElement, useRef, useState } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import Carousel from 'react-native-snap-carousel'
import Logo from '../../assets/logo/peachLogo.svg'
import { PrimaryButton } from '../../components/buttons'
import { useNavigation } from '../../hooks'
import i18n from '../../utils/i18n'
import { ContactButton } from '../report/components/ContactButton'
import LetsGetStarted from './LetsGetStarted'
import PeachOfMind from './PeachOfMind'
import Swipe from './Swipe'
import WelcomeToPeach from './WelcomeToPeach'
import YouOwnYourData from './YouOwnYourData'

const onStartShouldSetResponder = () => true

const screens = [WelcomeToPeach, Swipe, PeachOfMind, YouOwnYourData, LetsGetStarted]

export default (): ReactElement => {
  const navigation = useNavigation()
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
      <ContactButton style={tw`p-4 absolute top-0 left-0 z-10`} />
      <View style={tw`h-full flex-shrink flex-col items-center justify-end`}>
        <View style={tw`h-full flex-shrink flex-col items-center justify-end mt-16 pb-8`}>
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
      <View style={tw`mb-8 pt-4 flex items-center w-full`}>
        <View style={page === screens.length - 1 ? tw`opacity-0` : {}}>
          <PrimaryButton testID="welcome-next" narrow onPress={next}>
            {i18n('next')}
          </PrimaryButton>
        </View>
        <View style={tw`w-full flex-row justify-center mt-8`}>
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
