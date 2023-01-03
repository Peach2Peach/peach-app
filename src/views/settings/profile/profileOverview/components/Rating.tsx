import React from 'react'
import { View } from 'react-native'
import RatingPeach from '../../../../../assets/icons/ratingPeach.svg'
import { Text } from '../../../../../components'
import tw from '../../../../../styles/tailwind'
import { interpolate } from '../../../../../utils/math'

type RatingProps = ComponentProps & {
  rating: number
}

export const Rating = ({ rating, style }: RatingProps) => (
  <View style={[tw`flex-row`, style]}>
    {[1, 2, 3, 4, 5].map((peach) => (
      <RatingPeach
        key={peach}
        style={[tw`w-4 h-4 mr-1`, Math.floor(interpolate(rating, [-1, 1], [0, 5])) < peach && tw`opacity-50`]}
      />
    ))}
    <Text style={tw`black-2 tooltip font-bold`}>{interpolate(rating, [-1, 1], [0, 5]).toFixed(1)}/5</Text>
  </View>
)
