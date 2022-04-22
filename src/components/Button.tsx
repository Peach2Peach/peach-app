
import React, { ReactElement, useState } from 'react'
import {
  View,
  Pressable,
} from 'react-native'
import { Loading, Shadow, Text } from '.'
import tw from '../styles/tailwind'
import { mildShadowOrange, noShadow } from '../utils/layout'

type ButtonProps = ComponentProps & {
  title: string,
  secondary?: boolean,
  tertiary?: boolean,
  wide?: boolean,
  disabled?: boolean,
  loading?: boolean,
  onPress?: Function
}

/**
 * @description Component to display the Button
 * @param props Component properties
 * @param props.title button text
 * @param [props.secondary] if true, button is of secondary nature
 * @param [props.tertiary] if true, button is of tertiary nature
 * @param [props.wide] if true, button is taking on 100% width
 * @param [props.style] css style object
 * @param [props.disabled] if true disable interactions
 * @param [props.onPress] onPress handler from outside
 * @example
 * <Button
 *   title={i18n('form.save')}
 *   style={tw`mt-4`}
 *   onPress={save}
 * />
 */
export const Button = ({
  title,
  secondary,
  tertiary,
  wide = true,
  style,
  disabled,
  loading,
  onPress
}: ButtonProps): ReactElement => {
  const [active, setActive] = useState(false)

  return <Shadow {...(!secondary && !tertiary ? mildShadowOrange : noShadow)} viewStyle={[
    tw`rounded`,
    secondary ? tw`bg-white-2 border border-peach-1 `
      : tertiary ? tw`border border-white-2 `
        : tw`bg-peach-1`,
    wide ? tw`w-full` : tw`w-40`,
    active ? tw`bg-peach-2` : {},
    disabled ? tw`opacity-50` : {},
    style || {}
  ]}>
    <Pressable
      onPress={e => onPress && !disabled ? onPress(e) : null}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      style={tw`w-full flex-row items-center justify-center p-3`}
    >
      <Text style={[
        tw`font-baloo text-sm uppercase`,
        secondary ? tw`text-peach-1 ` : tw`text-white-2`,
        active ? tw`text-white-2` : {}
      ]}>
        {title}
      </Text>
      {loading
        ? <View style={tw`absolute right-5 w-4 h-4`}>
          <Loading size="small" color={tw`text-white-1`.color as string} />
        </View>
        : null
      }
    </Pressable>
  </Shadow>
}

export default Button