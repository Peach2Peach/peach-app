import React, { ReactElement } from 'react'
import { Shadow, Text } from '..'
import tw from '../../styles/tailwind'
import { dropShadowStrong } from '../../utils/layout'

export const ToolTip = ({ children, style }: ComponentProps): ReactElement => (
  <Shadow shadow={dropShadowStrong} style={[tw`rounded-lg bg-primary-background-light`, style]}>
    {children}
  </Shadow>
)
