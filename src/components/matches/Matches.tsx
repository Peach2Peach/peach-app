import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { Match } from '.'
import tw from '../../styles/tailwind'
import { getMatchCurrency, getMatchPaymentMethod } from '../../utils/match'
import { Navigation } from '../../utils/navigation'
import { Loading } from '../animation'
import Icon from '../Icon'

type MatchProps = ComponentProps & {
  matches: Match[]
  offer: BuyOffer | SellOffer
  onChange: (i?: number | null, currency?: Currency | null, paymentMethod?: PaymentMethod | null) => void
  onEndReached?: () => void
  loadingMore?: boolean
  toggleMatch: (match: Match) => void
  navigation: Navigation
}

type SliderArrowProps = {
  onPress: Function
}
const onStartShouldSetResponder = () => true

const shouldRenderShadow = (currentIndex: number, index: number) =>
  (currentIndex + 1 <= index && currentIndex + 5 >= index) || currentIndex === index

const PrevButton = ({ onPress }: SliderArrowProps) => (
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute left-2 z-10`}>
    <Icon id="sliderPrev" style={tw`w-4 h-4`} />
  </Pressable>
)

const NextButton = ({ onPress }: SliderArrowProps) => (
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute right-2 z-10`}>
    <Icon id="sliderNext" style={tw`w-4 h-4`} />
  </Pressable>
)

/**
 * @description Component to display matches
 * @example
 * <Matches matches={matches} />
 */
export const Matches = ({
  matches,
  offer,
  onChange,
  onEndReached,
  loadingMore,
  toggleMatch,
  navigation,
  style,
}: MatchProps): ReactElement => {
  const { width } = Dimensions.get('window')
  const $carousel = useRef<Carousel<any>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const onBeforeSnapToItem = (i: number) => {
    const currency = getMatchCurrency(offer, matches[i])
    const paymentMethod = getMatchPaymentMethod(offer, matches[i], currency)
    onChange(i, currency, paymentMethod)
    setCurrentIndex(i)
    if (onEndReached && i === matches.length - 1) onEndReached()
  }
  const snapToPrev = () => $carousel.current?.snapToPrev()
  const snapToNext = () => $carousel.current?.snapToNext()

  useEffect(() => {
    if (!matches.length) return
    const currency = getMatchCurrency(offer, matches[0])
    const paymentMethod = getMatchPaymentMethod(offer, matches[0], currency)
    onChange(0, currency, paymentMethod)
  }, [])

  return (
    <View style={[tw`flex-row items-center justify-center overflow-visible`, style]}>
      {currentIndex !== 0 && matches.length > 1 ? <PrevButton onPress={snapToPrev} /> : null}
      <Carousel
        loop={false}
        ref={$carousel}
        data={matches}
        enableSnap={true}
        enableMomentum={false}
        sliderWidth={width}
        itemWidth={width - 80}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        inactiveSlideShift={-10}
        activeSlideAlignment="center"
        lockScrollWhileSnapping={true}
        shouldOptimizeUpdates={true}
        onBeforeSnapToItem={onBeforeSnapToItem}
        keyExtractor={(item, index) => `${item.offerId}-${index}`}
        renderItem={({ item, index }) => (
          <View onStartShouldSetResponder={onStartShouldSetResponder} style={tw`-mx-4 px-4 py-4 bg-transparent`}>
            <Match
              match={item}
              offer={offer}
              toggleMatch={toggleMatch}
              onChange={onChange}
              navigation={navigation}
              renderShadow={shouldRenderShadow(currentIndex, index)}
            />
          </View>
        )}
      />
      {currentIndex < matches.length - 1 && matches.length > 1 ? (
        <NextButton onPress={snapToNext} />
      ) : loadingMore ? (
        <View style={tw`w-4 h-full items-end justify-center absolute z-10`}>
          <Loading style={tw`w-4 h-4`} />
        </View>
      ) : null}
    </View>
  )
}

export default Matches
