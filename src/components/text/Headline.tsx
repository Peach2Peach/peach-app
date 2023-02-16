import React, { ReactElement } from 'react'
import { ViewStyle } from 'react-native'
import { Text } from '.'
import tw from '../../styles/tailwind'

type HeadlineProps = ComponentProps

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
export const Headline = ({ style, children }: HeadlineProps): ReactElement => (
  <Text style={[tw`text-lg text-center uppercase h5 text-peach-1`, style as ViewStyle]}>{children}</Text>
)

export default Headline
