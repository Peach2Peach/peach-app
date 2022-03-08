import React, { ReactElement } from 'react'
import {
  Pressable,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '..'
import { Shadow } from 'react-native-shadow-2'
import { mildShadow } from '../../utils/layout'

interface MenuItemProps {
  text: string,
  onPress: Function,
}

/**
 * @description Component to display menu item
 * @param props Component properties
 * @param [props.text] label
 * @param [props.onPress] callback on press
 * @example
 * <MenuItem
 *   text={i18n('form.btcAddress')}
 * />
 */
export const MenuItem = ({
  text,
  onPress,
}: MenuItemProps): ReactElement => <Shadow {...mildShadow} viewStyle={tw`w-full  border border-grey-4 rounded `}>
  <Pressable onPress={() => onPress()}
    style={tw`h-10 pl-4 pr-2 flex flex-row items-center justify-between bg-white-1`}>
    <Text>{text}</Text>
    <Icon id="triangleRight" style={tw`w-6 h-6`} />
  </Pressable>
</Shadow>

export default MenuItem