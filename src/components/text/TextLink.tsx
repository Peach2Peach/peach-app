
import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { Text } from '.'
import tw from '../../styles/tailwind'

type TextLinkProps = ComponentProps & {
  onPress?: Function,
}

/**
 * @description Component to display text link
 * @param props Component properties
 * @param [props.onPress] function to execute on press
 * @param [props.style] if true, button is of secondary nature
 * @param [props.children] child nodes
 * @example
 * <TextLink style={tw`mt-4`}>
 *   {i18n('form.save')}
 * </TextLink>
 */
export const TextLink = ({ style, children, onPress }: TextLinkProps): ReactElement =>
  <Pressable onPress={(e) => onPress ? onPress(e) : null}>
    <Text style={[
      tw`text-peach-1 underline`,
      style
    ]}>
      {children}
    </Text>
  </Pressable>

export default TextLink