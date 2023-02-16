import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

type CardProps = ComponentProps

export const Card = ({ children, style }: CardProps): ReactElement => (
  <View style={[tw`w-full border rounded-2xl bg-primary-background-light border-black-5`, style]}>{children}</View>
)

export default Card
