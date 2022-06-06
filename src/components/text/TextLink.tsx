
import React, { ReactElement } from 'react'
import { GestureResponderEvent, Pressable, TouchableWithoutFeedback } from 'react-native'
import { Text } from '.'
import tw from '../../styles/tailwind'

const hitSlop = {
  top: 4,
  left: 4,
  bottom: 4,
  right: 4,
}

type TextLinkProps = ComponentProps & {
  onPress: (e: GestureResponderEvent) => void,
}

/**
 * @description Component to display text link
 * @param props Component properties
 * @param [props.onPress] function to execute on press
 * @param [props.style] if true, button is of secondary nature
 * @param [props.children] child nodes
 * @example
 * <TextLink style={tw`mt-4`} onPress={goToWebsite}>
 *   {i18n('form.save')}
 * </TextLink>
 */
export const TextLink = ({ style, children, onPress }: TextLinkProps): ReactElement =>
  <Text onPress={onPress} style={[
    tw`text-peach-1 underline`,
    style
  ]}>
    {children}
  </Text>

export default TextLink