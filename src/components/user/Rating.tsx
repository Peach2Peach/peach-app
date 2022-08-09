import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { interpolate } from '../../utils/math'
import Logo from '../../assets/logo/peachLogo.svg'

type RatingProps = ComponentProps & {
  rating: number,
}

export const Rating = ({ rating, style }: RatingProps): ReactElement =>
  <View style={[tw`flex-row`, style]}>
    {[1, 2, 3, 4, 5].map(peach => <Logo
      key={peach}
      style={[
        tw`w-4 h-4`,
        Math.round(interpolate(rating, [-1, 1], [0, 5])) < peach ? tw`opacity-50` : {},
      ]}
    />)}
  </View>

export default Rating