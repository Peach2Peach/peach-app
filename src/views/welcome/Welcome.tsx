import { useRef } from 'react'
import { Pressable, View, useWindowDimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { Icon, Progress, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { screens, useWelcomeSetup } from './hooks/useWelcomeSetup'

const onStartShouldSetResponder = () => true
export const Welcome = () => {
  const { width } = useWindowDimensions()
  const $carousel = useRef<Carousel<() => JSX.Element>>(null)
  const { page, setPage, progress, endReached, next, goToEnd } = useWelcomeSetup({ carousel: $carousel })
  const keyboardOpen = useKeyboard()

  return (
    <View style={tw`flex h-full`} testID="welcome">
      <View style={[tw`w-full px-sm`, tw.md`px-md`]}>
        <Progress
          percent={progress}
          backgroundStyle={tw`opacity-50 bg-primary-background-light`}
          barStyle={tw`bg-primary-background-light`}
          style={tw`h-2`}
        />
        <Pressable
          testID="welcome-skipFoward"
          onPress={goToEnd}
          style={[tw`flex flex-row items-center justify-end h-8`, endReached ? tw`opacity-0` : {}]}
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
                testID={`welcome-screen-${index}`}
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
