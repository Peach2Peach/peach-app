
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import { Match } from '.'
import Carousel from 'react-native-snap-carousel'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { StackNavigationProp } from '@react-navigation/stack'
import { getCurrencies, getMoPsInCommon, getPaymentMethods } from '../../utils/paymentMethod'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'search'>

type MatchProps = ComponentProps & {
  matches: Match[],
  offer: BuyOffer|SellOffer,
  onChange: (i?: number|null, currency?: Currency|null, paymentMethod?: PaymentMethod|null) => void,
  toggleMatch: (match: Match) => void,
  navigation: ProfileScreenNavigationProp,
}

type SliderArrowProps = {
  onPress: Function
}
const onStartShouldSetResponder = () => true

const shouldRenderShadow = (currentIndex: number, index: number) =>
  currentIndex + 1 <= index && currentIndex + 5 >= index || currentIndex === index

const PrevButton = ({ onPress }: SliderArrowProps) =>
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute left-2 z-10`}>
    <Icon id="sliderPrev" style={tw`w-4 h-4`}/>
  </Pressable>

const NextButton = ({ onPress }: SliderArrowProps) =>
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute right-2 z-10`}>
    <Icon id="sliderNext" style={tw`w-4 h-4`}/>
  </Pressable>

const getMatchCurrency = (offer: BuyOffer|SellOffer, match: Match) => {
  const mopsInCommon = getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
  const paymentMethodsInCommon = getPaymentMethods(mopsInCommon)
  const currencies = getCurrencies(paymentMethodsInCommon.length ? mopsInCommon : match.meansOfPayment)
  return match.selectedCurrency && currencies.indexOf(match.selectedCurrency) !== -1
    ? match.selectedCurrency
    : currencies[0]
}

const getMatchPaymentMethod = (offer: BuyOffer|SellOffer, match: Match, currency: Currency) => {
  const mopsInCommon = getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
  return match.selectedPaymentMethod || mopsInCommon[currency]![0]
}

/**
 * @description Component to display matches
 * @example
 * <Matches matches={matches} />
 */
export const Matches = ({ matches, offer, onChange, toggleMatch, navigation, style }: MatchProps): ReactElement => {
  const { width } = Dimensions.get('window')
  const $carousel = useRef<Carousel<any>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const onBeforeSnapToItem = (i: number) => {
    const currency = getMatchCurrency(offer, matches[i])
    const paymentMethod = getMatchPaymentMethod(offer, matches[i], currency)
    onChange(i, currency, paymentMethod)
    setCurrentIndex(i)
  }

  useEffect(() => {
    if (!matches.length) return
    const currency = getMatchCurrency(offer, matches[0])
    const paymentMethod = getMatchPaymentMethod(offer, matches[0], currency)
    onChange(0, currency, paymentMethod)
  }, [])

  return <View style={[tw`flex-row items-center justify-center overflow-visible`, style]}>
    {matches.length > 1
      ? <PrevButton onPress={() => $carousel.current?.snapToPrev()} />
      : null
    }
    <Carousel loop={true}
      ref={$carousel}
      data={matches}
      enableSnap={true} enableMomentum={false}
      sliderWidth={width} itemWidth={width - 80}
      inactiveSlideScale={0.9} inactiveSlideOpacity={0.7} inactiveSlideShift={-10}
      activeSlideAlignment="center"
      lockScrollWhileSnapping={true}
      shouldOptimizeUpdates={true}
      onBeforeSnapToItem={onBeforeSnapToItem}
      keyExtractor={(item, index) => `${item.offerId}-${index}`}
      renderItem={({ item, index }) => <View onStartShouldSetResponder={onStartShouldSetResponder}
        style={tw`-mx-4 px-4 py-4 bg-transparent`}>
        <Match match={item} offer={offer} toggleMatch={toggleMatch} onChange={onChange}
          navigation={navigation}
          renderShadow={shouldRenderShadow(currentIndex, index)} />
      </View>}
    />
    {matches.length > 1
      ? <NextButton onPress={() => $carousel.current?.snapToNext()} />
      : null
    }
  </View>
}

export default Matches