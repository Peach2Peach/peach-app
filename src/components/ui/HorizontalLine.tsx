import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

export const HorizontalLine = ({ style }: ComponentProps): ReactElement => (
  <View style={[tw`w-full h-px bg-black-5`, style]} />
)

export default HorizontalLine
