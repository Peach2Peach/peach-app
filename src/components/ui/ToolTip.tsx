import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Shadow } from '..'
import tw from '../../styles/tailwind'
import { dropShadowStrong } from '../../utils/layout'

export const ToolTip = ({ children, style }: ComponentProps): ReactElement => (
  <Shadow shadow={dropShadowStrong} style={style}>
    <View style={tw`px-3 py-2 rounded-lg bg-primary-background-light`}>{children}</View>
  </Shadow>
)
