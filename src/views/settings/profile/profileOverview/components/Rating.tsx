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
  <View style={[tw`flex-row items-center`, style]}>
    <View style={tw`flex-row`}>
      {[1, 2, 3, 4, 5].map((peach) => (
        <RatingPeach
          key={`rating-peach-background-${peach}`}
          style={[tw`w-4 h-4 opacity-50`, peach !== 5 && tw`mr-1`]}
        />
      ))}
      <View
        style={[
          tw`absolute flex-row self-center overflow-hidden`,
          { width: `${interpolate(rating, [-1, 1], [0, 100])}%` },
        ]}
      >
        {[1, 2, 3, 4, 5].map((peach) => (
          <RatingPeach key={`rating-peach-colored-${peach}`} style={[tw`w-4 h-4`, peach !== 5 && tw`mr-1`]} />
        ))}
      </View>
    </View>

    <Text style={tw`ml-1 text-black-2 button-small`}>{interpolate(rating, [-1, 1], [0, 5]).toFixed(1)}/5</Text>
  </View>
)

export const NewRating = ({ rating, style }: RatingProps) => (
  <View style={[tw`flex-row items-center`, style]}>
    <View style={tw`flex-row`}>
      {[1, 2, 3, 4, 5].map((peach) => (
        <RatingPeach key={`rating-peach-background-${peach}`} style={tw`w-4 h-4 mr-1 opacity-50`} />
      ))}
      <View
        style={[
          tw`absolute flex-row self-center overflow-hidden`,
          { width: `${interpolate(rating, [-1, 1], [0, 100])}%` },
        ]}
      >
        {[1, 2, 3, 4, 5].map((peach) => (
          <RatingPeach key={`rating-peach-colored-${peach}`} style={tw`w-4 h-4 mr-1`} />
        ))}
      </View>
    </View>

    <Text style={tw`text-black-2 button-small`}>{interpolate(rating, [-1, 1], [0, 5]).toFixed(1)}</Text>
  </View>
)
