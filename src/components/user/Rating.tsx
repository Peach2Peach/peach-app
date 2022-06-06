import React, { ReactElement } from 'react'
import { Image, View } from 'react-native'
import tw from '../../styles/tailwind'
import { interpolate } from '../../utils/math'

type RatingProps = ComponentProps & {
  rating: number,
}

export const Rating = ({ rating, style }: RatingProps): ReactElement =>
  <View style={[tw`flex-row`, style]}>
    {[1, 2, 3, 4, 5].map(peach => <Image
      key={peach}
      source={require('../../../assets/favico/peach-logo.png')}
      style={[
        tw`w-4 h-4`,
        Math.round(interpolate(rating, [-1, 1], [0, 5])) < peach ? tw`opacity-50` : {},
        { resizeMode: 'contain' }
      ]}
    />)}
  </View>

export default Rating