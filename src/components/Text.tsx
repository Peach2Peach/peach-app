
import React, { ReactElement, ReactNode } from 'react'
import {
  Text,
  ViewStyle
} from 'react-native'
import tw from '../styles/tailwind'

interface TextProps {
  style?: ViewStyle|ViewStyle[],
  children?: ReactNode
}

/**
 * @description Component to display text with predefined text style
 * @param props Component properties
 * @param [props.style] if true, button is of secondary nature
 * @param [props.children] child nodes
 * @example
 * <Text style={tw`mt-4`}>
 *   {i18n('form.save')}
 * </Text>
 */
export const PeachText = ({ style, children }: TextProps): ReactElement =>
  <Text style={[
    tw`font-lato text-lg text-black-1`,
    style
  ]}>
    {children}
  </Text>

export default PeachText