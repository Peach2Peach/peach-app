
import React, { ReactElement, ReactNode } from 'react'
import {
  ViewStyle
} from 'react-native'
import { Text } from '.'
import tw from '../../styles/tailwind'

interface HeadlineProps {
  style?: ViewStyle|ViewStyle[],
  children?: ReactNode,
}

/**
 * @description Component to display text with predefined text style
 * @param props Component properties
 * @param [props.style] if true, button is of secondary nature
 * @param [props.children] child nodes
 * @example
 * <Headline style={tw`mt-4`}>
 *   {i18n('form.save')}
 * </Headline>
 */
export const Headline = ({ style, children }: HeadlineProps): ReactElement =>
  <Text style={[
    tw`font-baloo text-xl uppercase text-center text-peach-1`,
    style as ViewStyle
  ]}>
    {children}
  </Text>

export default Headline