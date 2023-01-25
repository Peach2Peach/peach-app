import React, { useRef } from 'react'
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

export default ({ offerId }: { offerId: string }) => {
  const $carousel = useRef<Carousel<any>>(null)
  const { allMatches: matches, isLoading, isFetchingNextPage } = useOfferMatches()

  const snapToPrev = () => $carousel.current?.snapToPrev()
  const snapToNext = () => $carousel.current?.snapToNext()
  const [currentIndex, setCurrentIndex] = useMatchStore((state) => [state.currentIndex, state.setCurrentIndex], shallow)

  const onBeforeSnapToItem = (index: number) => {
    // ensure that index can't be higher than available matches
    setCurrentIndex(Math.min(index, matches.length - 1))
  }

  return (
    <View style={tw`flex-row items-center justify-center overflow-visible`}>
      {matches[currentIndex - 1] !== undefined && <PrevButton onPress={snapToPrev} />}
      {matches[currentIndex] !== undefined && (
        <Carousel
          ref={$carousel}
          data={matches}
          {...{ ...carouselConfig, onBeforeSnapToItem }}
          renderItem={({ item, index }) => (
            <View {...{ onStartShouldSetResponder }} style={tw`px-4 py-4 -mx-4 bg-transparent`}>
              <Match renderShadow={shouldRenderShadow(currentIndex, index)} match={item} offerId={offerId} />
            </View>
          )}
        />
      )}
      {matches[currentIndex + 1] !== undefined ? (
        <NextButton onPress={snapToNext} />
      ) : (
        (isLoading || isFetchingNextPage) && <Loading style={tw`absolute z-10 w-4 h-4 right-4`} size="small" />
      )}
    </View>
  )
}
