import React, { ReactElement } from 'react'
import { Shadow, Text } from '..'
import tw from '../../styles/tailwind'
import { mildShadow } from '../../utils/layout'

export const ToolTip = ({ children, style }: ComponentProps): ReactElement => (
  <Shadow shadow={mildShadow} style={[tw`py-2 rounded-lg bg-primary-background-light`, style]}>
    <Text style={tw`w-16 font-semibold text-center`}>{children}</Text>
  </Shadow>
)
