import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'
import { dropShadowMild } from '../utils/layout'
import { Shadow } from '.'

type CardProps = ComponentProps

export const Card = ({ children, style }: CardProps): ReactElement => (
  <Shadow shadow={dropShadowMild}>
    <View style={[tw`w-full rounded-2xl bg-primary-background-light`, style]}>{children}</View>
  </Shadow>
)

export default Card
