import { useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import Carousel from 'react-native-snap-carousel'
import { Icon, Progress, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { useKeyboard } from '../../hooks'
import { useCheckShowRedesignWelcome } from '../../hooks/'
import { useOnboardingHeader } from '../../hooks/headers/useOnboardingHeader'
import i18n from '../../utils/i18n'
import AWalletYouControl from './AWalletYouControl'
import LetsGetStarted from './LetsGetStarted'
import PeachOfMind from './PeachOfMind'
import PeerToPeer from './PeerToPeer'
import PrivacyFirst from './PrivacyFirst'

const onStartShouldSetResponder = () => true

const screens = [PeerToPeer, PeachOfMind, PrivacyFirst, AWalletYouControl, LetsGetStarted]

export default () => {
  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    hideGoBackButton: true,
  })
  const [{ width }] = useState(() => Dimensions.get('window'))
  const [page, setPage] = useState(0)
  const $carousel = useRef<Carousel<any>>(null)
  const keyboardOpen = useKeyboard()
  const checkShowRedesignWelcome = useCheckShowRedesignWelcome()

  const next = () => {
    $carousel.current?.snapToNext()
  }
  const goToEnd = () => {
    $carousel.current?.snapToItem(screens.length - 1)
  }
  const getProgress = () => (page + 1) / screens.length
  const endReached = () => getProgress() === 1

  useEffect(() => {
    checkShowRedesignWelcome()
  }, [checkShowRedesignWelcome])

  return (
    <View style={tw`flex h-full`} testID="welcome">
      <View style={tw`w-full px-8`}>
        <Progress
          percent={getProgress()}
          backgroundStyle={tw`opacity-50 bg-primary-background-light`}
          barStyle={tw`bg-primary-background-light`}
          style={tw`h-2`}
        />
        <Pressable
          testID="welcome-skipFoward"
          onPress={goToEnd}
          style={[tw`flex flex-row items-center justify-end h-8`, endReached() ? tw`opacity-0` : {}]}
        >
          <Text style={tw`mr-1 text-primary-background-light`}>{i18n('skip')}</Text>
          <Icon id="skipForward" style={tw`w-3 h-3`} color={tw`text-primary-background-light`.color} />
        </Pressable>
      </View>
      <View style={tw`flex-col items-center justify-end flex-shrink h-full`}>
        <View style={tw`flex-shrink w-full h-full`}>
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
            renderItem={({ item: Item, index }) => (
              <View
                testID={'welcome-screen-' + index}
                onStartShouldSetResponder={onStartShouldSetResponder}
                style={tw`h-full px-6`}
              >
                <Item />
              </View>
            )}
          />
        </View>
      </View>
      {!keyboardOpen && (
        <View style={[tw`flex items-center w-full pt-4 mb-8`, page === screens.length - 1 ? tw`opacity-0` : {}]}>
          <PrimaryButton testID="welcome-next" narrow white onPress={next} iconId="arrowRightCircle">
            {i18n('next')}
          </PrimaryButton>
        </View>
      )}
    </View>
  )
}
