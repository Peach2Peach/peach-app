
import React, { ReactElement, useState } from 'react'
import {
  Pressable,
  View,
  ViewStyle
} from 'react-native'
import tw from '../styles/tailwind'
import Text from './Text'

interface ButtonProps {
  title: string,
  secondary?: boolean,
  wide?: boolean,
  style?: ViewStyle|ViewStyle[],
  onPress?: Function
}

/**
 * @description Component to display the Button
 * @param props Component properties
 * @param props.title button text
 * @param [props.secondary] if true, button is of secondary nature
 * @param [props.wide] if true, button is taking on 100% width
 * @param [props.style] css style object
 * @param [props.onPress] onPress handler from outside
 * @example
 * <Button
 *   title={i18n('form.save')}
 *   style={tw`mt-4`}
 *   onPress={save}
 * />
 */
export default ({ title, secondary, wide = true, style, onPress }: ButtonProps): ReactElement => {
  const [active, setActive] = useState(false)

  return <View>
    <Pressable
      style={[
        tw`flex items-center justify-center p-3 rounded`,
        secondary ? tw`bg-white-1 border border-peach-1 ` : tw`bg-peach-1`,
        wide ? tw`w-full` : tw`w-40`,
        active ? tw`bg-peach-2` : {},
        style
      ]}
      onPress={e => onPress ? onPress(e) : null}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
    >
      <Text style={[
        tw`font-baloo text-sm`,
        secondary ? tw`text-peach-1 ` : tw`text-white-1`,
        active ? tw`text-white-1` : {}
      ]}>
        {title}
      </Text>
    </Pressable>
  </View>
}