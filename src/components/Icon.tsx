
import React, { ReactElement } from 'react'
import {
  ViewStyle
} from 'react-native'
import { Text } from '.'
import Icons from './icons'
interface IconProps {
  id: string,
  style?: ViewStyle|ViewStyle[],
  color?: string,
}

/**
 * @description Component to display an icon
 * @param props Component properties
 * @param props.id icon id
 * @param [props.style] css style object
 * @example
 * <Icon
 *   id={'save'}
 *   style={tw`mt-4`}
 * />
 */
export const Icon = ({ id, style, color }: IconProps): ReactElement => {
  const SVG = Icons[id]

  return SVG
    ? <SVG style={style} fill={color || '#888' }/>
    : <Text>❌</Text>
}

export default Icon