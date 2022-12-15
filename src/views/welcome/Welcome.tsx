import React, { ReactElement, useRef, useState } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import Carousel from 'react-native-snap-carousel'
import { Icon, Progress, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { useBackgroundSetup } from '../../hooks/useBackgroundSetup'
import i18n from '../../utils/i18n'
import LetsGetStarted from './LetsGetStarted'
import PeachOfMind from './PeachOfMind'
import PeerToPeer from './PeerToPeer'
import PrivacyFirst from './PrivacyFirst'
import { useWelcomeHeader } from './useWelcomeHeader'

const onStartShouldSetResponder = () => true

const screens = [PeerToPeer, PeachOfMind, PrivacyFirst, LetsGetStarted]
const backgroundConfig = { color: 'primaryGradient' as const }

export default (): ReactElement => {
  useWelcomeHeader()
  useBackgroundSetup(backgroundConfig)
  const [{ width }] = useState(() => Dimensions.get('window'))
  const [page, setPage] = useState(0)
  const $carousel = useRef<Carousel<any>>(null)

  const next = () => {
    $carousel.current?.snapToNext()
  }
  const goToEnd = () => {
    $carousel.current?.snapToItem(screens.length - 1)
  }
  const getProgress = () => (page + 1) / screens.length
  const endReached = () => getProgress() === 1

  return (
    <View style={tw`h-full flex`} testID="welcome">
      <View style={tw`w-full px-8`}>
        <Progress percent={getProgress()} color={tw`bg-primary-background-light`} style={tw`h-2`} />
        <Pressable
          onPress={goToEnd}
          style={[tw`h-8 flex flex-row justify-end items-center`, endReached() ? tw`opacity-0` : {}]}
        >
          <Text style={tw`text-primary-background-light mr-1`}>{i18n('skip')}</Text>
          <Icon id="skipForward" style={tw`w-3 h-3`} color={tw`text-primary-background-light`.color} />
        </Pressable>
      </View>
      <View style={tw`h-full flex-shrink flex-col items-center justify-end`}>
        <View style={tw`w-full h-full flex-shrink`}>
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
          <PrimaryButton testID="welcome-next" narrow white onPress={next} iconId="arrowRightCircle">
            {i18n('next')}
          </PrimaryButton>
        </View>
      </View>
    </View>
  )
}
