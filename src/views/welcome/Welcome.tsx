import { useRef } from 'react'
import { TouchableOpacity, View, useWindowDimensions } from 'react-native'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { Icon, Progress, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { screens, useWelcomeSetup } from './hooks/useWelcomeSetup'

export const Welcome = () => {
  const { width } = useWindowDimensions()
  const $carousel = useRef<ICarouselInstance>(null)
  const { page, setPage, progress, endReached, next, goToEnd } = useWelcomeSetup({ carousel: $carousel })
  const keyboardOpen = useKeyboard()

  return (
    <Screen gradientBackground>
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
            <View onStartShouldSetResponder={() => true} style={tw`h-full px-6`}>
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
