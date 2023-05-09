import { ReactElement } from 'react'
import { FillProps } from 'react-native-svg'
import { Text } from '.'
import tw from '../styles/tailwind'
import Icons, { IconType } from '../assets/icons'

type Props = ComponentProps & {
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
export const Icon = ({ id, style, color }: Props): ReactElement => {
  const SVG = Icons[id]
  const iconStyle = Array.isArray(style) ? style : [style]

  return SVG ? <SVG style={[tw`w-6 h-6`, ...iconStyle]} fill={color || '#888'} /> : <Text>❌</Text>
}

export default Icon
