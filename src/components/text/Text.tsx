
import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import tw from '../../styles/tailwind'

type TextProps = ComponentProps & {
  numberOfLines?: number
  ellipsizeMode?: 'head'|'tail'|'middle'|'clip'
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
      tw`font-lato text-base text-grey-1`,
      tw.md`text-lg leading-5`,
      style
    ]}
    allowFontScaling={false}
    numberOfLines={numberOfLines}
    ellipsizeMode={ellipsizeMode}>
    {children}
  </Text>

export default PeachText