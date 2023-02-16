import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'

type MenuItemProps = ComponentProps & {
  text: string
  onPress: Function
}

/**
 * @description Component to display menu item
 * @param props Component properties
 * @param [props.text] label
 * @param [props.onPress] callback on press
 * @example
 * <MenuItem
 *   text={i18n('form.address.btc')}
 * />
 */
export const MenuItem = ({ style, text, onPress }: MenuItemProps): ReactElement => (
  <View style={[tw`w-full border rounded border-grey-4`, style || {}]}>
    <Pressable
      onPress={() => onPress()}
      style={[tw`flex flex-row items-center justify-between h-8 pl-4 pr-2 bg-white-1`, tw.md`h-10`]}
    >
      <Text>{text}</Text>
    </Pressable>
  </View>
)

export default MenuItem
