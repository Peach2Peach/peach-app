import React, { useRef } from 'react'
import { Dimensions, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import tw from '../../styles/tailwind'
import { useOfferMatches } from '../../views/search/hooks/useOfferMatches'
import { Loading } from '../animation'
import { PrevButton, NextButton } from './buttons'
import Match from './Match'
import { useMatchStore } from './store'

const { width } = Dimensions.get('window')
const carouselConfig = {
  loop: false,
  enableMomentum: false,
  sliderWidth: width,
  itemWidth: width - 80,
  inactiveSlideScale: 0.9,
  inactiveSlideOpacity: 0.7,
  inactiveSlideShift: -10,
  activeSlideAlignment: 'center' as 'center',
  enableSnap: true,
  shouldOptimizeUpdates: true,
  lockScrollWhileSnapping: true,
  keyExtractor: (item: any, index: number) => `${item.offerId}-${index}`,
}

const onStartShouldSetResponder = () => true
const shouldRenderShadow = (currentIndex: number, index: number) =>
  (currentIndex + 1 <= index && currentIndex + 5 >= index) || currentIndex === index

export default () => {
  const $carousel = useRef<Carousel<any>>(null)
  const {
    data: { matches },
    isLoading,
  } = useOfferMatches()

  const snapToPrev = () => $carousel.current?.snapToPrev()
  const snapToNext = () => $carousel.current?.snapToNext()
  const { currentIndex, setCurrentIndex: onBeforeSnapToItem } = useMatchStore()

  return (
    <View style={tw`flex-row items-center justify-center overflow-visible`}>
      {currentIndex !== 0 && <PrevButton onPress={snapToPrev} />}
      <Carousel
        ref={$carousel}
        data={matches}
        {...{ ...carouselConfig, onBeforeSnapToItem }}
        renderItem={({ item, index }) => (
          <View {...{ onStartShouldSetResponder }} style={tw`-mx-4 px-4 py-4 bg-transparent`}>
            <Match renderShadow={shouldRenderShadow(currentIndex, index)} match={item} />
          </View>
        )}
      />
      {currentIndex < matches.length - 1 && matches.length > 1 ? (
        <NextButton onPress={snapToNext} />
      ) : (
        !!isLoading && <Loading style={tw`w-4 h-4 absolute right-4 z-10`} size="small" />
      )}
    </View>
  )
}
