
import React, { ReactElement, useRef, useState } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import { Match } from '.'
import Carousel from 'react-native-snap-carousel'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

type MatchProps = ComponentProps & {
  matches: Match[],
  onChange: (i: number) => void,
}

type SliderArrowProps = {
  onPress: Function
}
const PrevButton = ({ onPress }: SliderArrowProps) =>
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute left-2 z-10`}>
    <Icon id="sliderPrev" style={tw`w-4 h-4`}/>
  </Pressable>

const NextButton = ({ onPress }: SliderArrowProps) =>
  <Pressable onPress={(e) => onPress(e)} style={tw`absolute right-2 z-10`}>
    <Icon id="sliderNext" style={tw`w-4 h-4`}/>
  </Pressable>

//  showsButtons={true} showsPagination={false}
// prevButton={<PrevButton />} nextButton={<NextButton />}
/**
 * @description Component to display matches
 * @example
 * <Matches matches={matches} />
 */
export const Matches = ({ matches, onChange, style }: MatchProps): ReactElement => {
  const { width } = Dimensions.get('window')
  const $carousel = useRef<Carousel<any>>(null)

  return <View style={[tw`flex-row items-center justify-center`, style]}>
    {matches.length > 1
      ? <PrevButton onPress={() => $carousel.current?.snapToPrev()} />
      : null
    }
    <Carousel loop={true}
      ref={$carousel}
      data={matches}
      containerCustomStyle={[tw`overflow-visible`]}
      sliderWidth={width}
      itemWidth={width - 80}
      inactiveSlideScale={0.9}
      inactiveSlideOpacity={0.7}
      activeSlideAlignment="center"
      onSnapToItem={onChange}
      renderItem={({ item }) => <View style={tw`px-2`} onStartShouldSetResponder={() => true}>
        <Match match={item} />
      </View>}
    />
    {matches.length > 1
      ? <NextButton onPress={() => $carousel.current?.snapToNext()} />
      : null
    }
  </View>
}

export default Matches