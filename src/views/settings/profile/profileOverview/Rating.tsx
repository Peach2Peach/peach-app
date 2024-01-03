import { View } from 'react-native'
import RatingPeach from '../../../../../assets/icons/ratingPeach.svg'
import { PeachText } from '../../../../components/text/PeachText'
import { CENT } from '../../../../constants'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { interpolate } from '../../../../utils/math/interpolate'

// eslint-disable-next-line no-magic-numbers
const PEACHES = [1, 2, 3, 4, 5]

type RatingProps = {
  rating: number
  isNewUser?: boolean
}

export const Rating = ({ rating, isNewUser }: RatingProps) =>
  isNewUser ? (
    <PeachText style={tw`subtitle-2 text-black-65`}>{i18n('newUser')}</PeachText>
  ) : (
    <View style={tw`flex-row items-center`}>
      <View style={tw`flex-row gap-1`}>
        {PEACHES.map((peach) => (
          <RatingPeach key={`rating-peach-background-${peach}`} style={tw`w-3 h-3 opacity-50`} />
        ))}
        <View
          style={[
            tw`absolute flex-row self-center gap-1 overflow-hidden`,
            { width: `${interpolate(rating, [-1, 1], [0, CENT])}%` },
          ]}
        >
          {PEACHES.map((peach) => (
            <RatingPeach key={`rating-peach-colored-${peach}`} style={tw`w-3 h-3`} />
          ))}
        </View>
      </View>

      <PeachText style={tw`text-black-65 button-small`}>{interpolate(rating, [-1, 1], [0, 5]).toFixed(1)}</PeachText>
    </View>
  )
