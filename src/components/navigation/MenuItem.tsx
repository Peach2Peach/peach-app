import React, { ReactElement } from 'react'
import {
  Pressable,
} from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Shadow, Text } from '..'
import { mildShadow } from '../../utils/layout'

type MenuItemProps = ComponentProps & {
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
  style,
  text,
  onPress,
}: MenuItemProps): ReactElement =>
  <Shadow shadow={mildShadow} style={[
    tw`w-full border border-grey-4 rounded`,
    style || {},
  ]}>
    <Pressable onPress={() => onPress()}
      style={[
        tw`h-8 pl-4 pr-2 flex flex-row items-center justify-between bg-white-1`,
        tw.md`h-10`,
      ]}>
      <Text>{text}</Text>
      <Icon id="triangleRight" style={tw`w-6 h-6`} />
    </Pressable>
  </Shadow>

export default MenuItem