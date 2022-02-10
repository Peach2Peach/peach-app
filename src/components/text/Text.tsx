
import React, { ReactElement, ReactNode } from 'react'
import {
  Text,
  ViewStyle
} from 'react-native'
import tw from '../../styles/tailwind'

interface TextProps {
  style?: ViewStyle|ViewStyle[],
  children?: ReactNode,
  numberOfLines?: number
  ellipsizeMode?: 'head'|'tail'|'middle'
}

/**
 * @description Component to display text with predefined text style
 * @param props Component properties
 * @param [props.style] if true, button is of secondary nature
 * @param [props.children] child nodes
 * @param [props.numberOfLines] number of allowed lines
 * @param [props.ellipsizeMode] where to cut off the text with ...
 * @example
 * <Text style={tw`mt-4`}>
 *   {i18n('form.save')}
 * </Text>
 */
export const PeachText = ({ style, children, numberOfLines, ellipsizeMode }: TextProps): ReactElement =>
  <Text
    style={[
      tw`font-lato text-lg text-black-1`,
      style
    ]}
    numberOfLines={numberOfLines}
    ellipsizeMode={ellipsizeMode}>
    {children}
  </Text>

export default PeachText