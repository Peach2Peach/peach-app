import { FillProps } from 'react-native-svg'
import { PeachText } from './text/Text'
import tw from '../styles/tailwind'
import Icons, { IconType } from '../assets/icons'

type Props = ComponentProps & {
  id: IconType
  color?: FillProps['fill']
}

export const Icon = ({ id, style, color }: Props) => {
  const SVG = Icons[id]
  const iconStyle = Array.isArray(style) ? style : [style]

  return SVG ? <SVG style={[tw`w-6 h-6`, ...iconStyle]} fill={color || '#888'} /> : <PeachText>❌</PeachText>
}

export default Icon
