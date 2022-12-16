import React, { useCallback, useEffect, useRef } from 'react'
import { Dimensions, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import tw from '../../styles/tailwind'
import { useOfferMatches } from '../../views/search/hooks/useOfferMatches'
import { Loading } from '../animation'
import { PrevButton, NextButton } from './buttons'
import Match from './Match'
import { useMatchStore } from './store'
import shallow from 'zustand/shallow'

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
  const { allMatches: matches, isLoading, isFetchingNextPage } = useOfferMatches()

  const snapToPrev = () => $carousel.current?.snapToPrev()
  const snapToNext = () => $carousel.current?.snapToNext()
  const [currentIndex, onBeforeSnapToItem] = useMatchStore(
    (state) => [state.currentIndex, state.setCurrentIndex],
    shallow,
  )

  return (
    <View style={tw`flex-row items-center justify-center overflow-visible`}>
      {matches[currentIndex - 1] !== undefined && <PrevButton onPress={snapToPrev} />}
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
      {matches[currentIndex + 1] !== undefined ? (
        <NextButton onPress={snapToNext} />
      ) : (
        (isLoading || isFetchingNextPage) && <Loading style={tw`w-4 h-4 absolute right-4 z-10`} size="small" />
      )}
    </View>
  )
}
