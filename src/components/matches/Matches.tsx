
import React, { ReactElement, useEffect, useRef } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import { Match } from '.'
import Carousel from 'react-native-snap-carousel'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

type MatchProps = ComponentProps & {
  matches: Match[],
  offer: BuyOffer|SellOffer,
  onChange: (i?: number|null, currency?: Currency|null, paymentMethod?: PaymentMethod|null) => void,
  toggleMatch: (match: Match) => void,
}

type SliderArrowProps = {
  onPress: Function
}
const onStartShouldSetResponder = () => true

const PrevButton = ({ onPress }: SliderArrowProps) =>
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute left-2 z-10`}>
    <Icon id="sliderPrev" style={tw`w-4 h-4`}/>
  </Pressable>

const NextButton = ({ onPress }: SliderArrowProps) =>
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute right-2 z-10`}>
    <Icon id="sliderNext" style={tw`w-4 h-4`}/>
  </Pressable>

const getMatchCurrency = (match: Match) => match.selectedCurrency || Object.keys(match.prices)[0] as Currency
const getMatchPaymentMethod = (match: Match) => match.selectedPaymentMethod || match.paymentMethods[0]

/**
 * @description Component to display matches
 * @example
 * <Matches matches={matches} />
 */
export const Matches = ({ matches, offer, onChange, toggleMatch, style }: MatchProps): ReactElement => {
  const { width } = Dimensions.get('window')
  const $carousel = useRef<Carousel<any>>(null)

  const onBeforeSnapToItem = (i: number) => {
    onChange(i, getMatchCurrency(matches[i]), getMatchPaymentMethod(matches[i]))
  }

  useEffect(() => {
    if (!matches.length) return
    onChange(null, getMatchCurrency(matches[0]), getMatchPaymentMethod(matches[0]))
  }, [])

  return <View style={[tw`flex-row items-center justify-center`, style]}>
    {matches.length > 1
      ? <PrevButton onPress={() => $carousel.current?.snapToPrev()} />
      : null
    }
    <Carousel loop={true}
      ref={$carousel}
      data={matches}
      containerCustomStyle={[tw`overflow-visible`]}
      sliderWidth={width} itemWidth={width - 80}
      inactiveSlideScale={0.9} inactiveSlideOpacity={0.7} inactiveSlideShift={-10}
      activeSlideAlignment="center"
      lockScrollWhileSnapping={true}
      shouldOptimizeUpdates={true}
      onBeforeSnapToItem={onBeforeSnapToItem}
      renderItem={({ item }) => <View onStartShouldSetResponder={onStartShouldSetResponder} style={tw`-mx-4 px-4`}>
        <Match match={item} offer={offer} toggleMatch={toggleMatch} onChange={onChange} />
      </View>}
    />
    {matches.length > 1
      ? <NextButton onPress={() => $carousel.current?.snapToNext()} />
      : null
    }
  </View>
}

export default Matches