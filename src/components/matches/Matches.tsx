
import React, { ReactElement, useRef, useState } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'
import { Match } from '.'
import Carousel from 'react-native-snap-carousel'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import GetWindowDimensions from '../../hooks/GetWindowDimensions'

interface MatchProps {
  matches: Match[],
  onChange: (i: number) => void,
  style?: ViewStyle|ViewStyle[],
}

type SliderArrowProps = {
  onPress: Function
}
const PrevButton = ({ onPress }: SliderArrowProps) => <Pressable onPress={(e) => onPress(e)}>
  <View style={tw`rounded-full bg-peach-1 w-5 h-5 flex items-center justify-center`}>
    <Icon id="prev" style={tw`w-4 h-4`}/>
  </View>
</Pressable>

const NextButton = ({ onPress }: SliderArrowProps) => <Pressable onPress={(e) => onPress(e)}>
  <View style={tw`rounded-full bg-peach-1 w-5 h-5 flex items-center justify-center`}>
    <Icon id="next" style={tw`w-4 h-4`}/>
  </View>
</Pressable>

//  showsButtons={true} showsPagination={false}
// prevButton={<PrevButton />} nextButton={<NextButton />}
/**
 * @description Component to display matches
 * @example
 * <Matches matches={matches} />
 */
export const Matches = ({ matches, onChange, style }: MatchProps): ReactElement => {
  const [{ width }] = useState(GetWindowDimensions())
  const $carousel = useRef<Carousel<any>>(null)

  return <View style={[tw`flex-row items-center`, style]}>
    {matches.length > 1
      ? <PrevButton onPress={() => $carousel.current?.snapToPrev()} />
      : null
    }
    <Carousel loop={true}
      ref={$carousel}
      data={matches}
      sliderWidth={width - 40}
      itemWidth={width - 40}
      onSnapToItem={onChange}
      renderItem={({ item }) => <View style={tw`px-2`} >
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