import React, { ReactElement } from 'react'
import { FillProps } from 'react-native-svg'
import { Text } from '.'
import Icons, { IconType } from './icons'

type IconProps = ComponentProps & {
  id: IconType
  color?: FillProps['fill']
}

/**
 * @description Component to display an icon
 * @param props Component properties
 * @param props.id icon id
 * @param [props.style] css style object
 * @param [props.color] icon color
 * @example
 * <Icon
 *   id={'save'}
 *   style={tw`mt-4`}
 *   color={tw`text-white-1`.color as string}
 * />
 */
export const Icon = ({ id, style, color }: IconProps): ReactElement => {
  const SVG = Icons[id]

  return SVG ? <SVG style={style} fill={color || '#888'} /> : <Text>❌</Text>
}

export default Icon
