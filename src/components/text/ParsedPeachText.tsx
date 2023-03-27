import React, { ReactElement } from 'react'
import ParsedText, { ParsedTextProps } from 'react-native-parsed-text'

import tw from '../../styles/tailwind'

export type Props = ComponentProps & ParsedTextProps

export const ParsedPeachText = ({ style, ...props }: Props): ReactElement => (
  <ParsedText style={[tw`body-m text-black-1`, style]} allowFontScaling={false} {...props} />
)
