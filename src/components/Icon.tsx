
import React, { ReactElement } from 'react'
import {
  ViewStyle
} from 'react-native'
import Icons from './icons'

interface IconProps {
  id: string,
  style?: ViewStyle|ViewStyle[]
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
export const Icon = ({ id, style }: IconProps): ReactElement => {
  const SVG = Icons[id]
  return <SVG style={style} />
}

export default Icon