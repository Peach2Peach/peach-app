
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

import tw from '../styles/tailwind'
import { mildShadow } from '../utils/layout'

type CardProps = ComponentProps

/**
 * @description Component to display a Card component
 * @param children child nodes
 * @param [props.style] additional styles to apply to the component
 * @example
 * <Card>
 *  <Text>This is a card</Text>
 * </Card>
 */
export const Card = ({ children, style }: CardProps): ReactElement =>
  <Shadow {...mildShadow}
    viewStyle={[
      tw`w-full border border-grey-4 rounded bg-white-1`,
      style
    ]}>
    <View>
      {children}
    </View>
  </Shadow>

export default Card