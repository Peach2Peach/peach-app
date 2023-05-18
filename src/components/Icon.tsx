import { ReactElement } from 'react'
import { FillProps } from 'react-native-svg'
import { PeachText } from './text/Text'
import tw from '../styles/tailwind'
import Icons, { IconType } from '../assets/icons'

type IconProps = ComponentProps & {
  id: IconType
  color?: FillProps['fill']
}

/**
 * @example
 * <Icon
 *   id={'save'}
 *   style={tw`mt-4`}
 *   color={tw`text-black-1`.color}
 * />
 */
export const Icon = ({ id, style, color }: IconProps): ReactElement => {
  const SVG = Icons[id]

  return SVG ? <SVG style={[tw`w-6 h-6`, style]} fill={color || '#888'} /> : <PeachText>❌</PeachText>
}

export default Icon
