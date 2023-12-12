import { View } from 'react-native'

import RatingPeach from '../../../../../assets/icons/ratingPeach.svg'
import { Text } from '../../../../../components'
import { CENT } from '../../../../../constants'
import tw from '../../../../../styles/tailwind'
import i18n from '../../../../../utils/i18n'
import { interpolate } from '../../../../../utils/math/interpolate'

// eslint-disable-next-line no-magic-numbers
const PEACHES = [1, 2, 3, 4, 5]

type RatingProps = ComponentProps & {
  rating: number
  isNewUser?: boolean
}

export const Rating = ({ rating, style, isNewUser }: RatingProps) =>
  isNewUser ? (
    <Text style={tw`subtitle-2 text-black-2`}>{i18n('newUser')}</Text>
  ) : (
    <View style={[tw`flex-row items-center`, style]}>
      <View style={tw`flex-row`}>
        {PEACHES.map((peach) => (
          <RatingPeach key={`rating-peach-background-${peach}`} style={tw`w-3 h-3 mr-1 opacity-50`} />
        ))}
        <View
          style={[
            tw`absolute flex-row self-center overflow-hidden`,
            { width: `${interpolate(rating, [-1, 1], [0, CENT])}%` },
          ]}
        >
          {PEACHES.map((peach) => (
            <RatingPeach key={`rating-peach-colored-${peach}`} style={tw`w-3 h-3 mr-1`} />
          ))}
        </View>
      </View>

      <Text style={tw`text-black-2 button-small`}>{interpolate(rating, [-1, 1], [0, 5]).toFixed(1)}</Text>
    </View>
  )
