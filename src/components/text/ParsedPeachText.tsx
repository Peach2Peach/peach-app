import ParsedText, { ParsedTextProps } from 'react-native-parsed-text'
import tw from '../../styles/tailwind'
import { shouldNormalCase } from './helpers/shouldNormalCase'

export type Props = ComponentProps & ParsedTextProps

export const ParsedPeachText = ({ style, ...props }: Props) => (
  <ParsedText
    style={[tw`body-m text-black-100`, style, shouldNormalCase(style) && tw`normal-case`]}
    allowFontScaling={false}
    {...props}
  />
)
