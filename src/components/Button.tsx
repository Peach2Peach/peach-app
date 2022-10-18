import React, { ReactElement, useState } from 'react'
import { View, Pressable, GestureResponderEvent } from 'react-native'
import { Style } from 'twrnc/dist/esm/types'
import { Loading, Shadow, Text } from '.'
import tw from '../styles/tailwind'
import { mildShadowOrange } from '../utils/layout'

type ButtonProps = ComponentProps & {
  title: string | JSX.Element
  secondary?: boolean
  tertiary?: boolean
  grey?: boolean
  help?: boolean
  red?: boolean
  textColor?: Style
  bgColor?: Style
  wide?: boolean
  disabled?: boolean
  loading?: boolean
  onPress?: Function
}

// eslint-disable-next-line complexity
const ButtonContent = ({
  title,
  secondary,
  tertiary,
  grey,
  help,
  red,
  textColor,
  bgColor,
  loading,
  disabled,
  onPress,
  testID,
}: ButtonProps): ReactElement => {
  const [active, setActive] = useState(false)

  const onPressHandler = (e: GestureResponderEvent) => (onPress && !disabled ? onPress(e) : null)

  const onPressInHandler = () => setActive(true)
  const onPressOutHandler = () => setActive(false)
  const color = textColor
    ? textColor
    : secondary
      ? tw`text-peach-1`
      : grey
        ? tw`text-grey-2`
        : help
          ? tw`text-blue-1`
          : red
            ? tw`text-red`
            : tw`text-white-2`

  const backgroundColor = bgColor ? bgColor : secondary || grey || help || red ? tw`bg-white-2` : tw`bg-peach-1`
  const bgColorActive = grey ? tw`bg-grey-2` : tw`bg-peach-2`
  const border = secondary
    ? tw`border border-peach-1`
    : tertiary
      ? tw`border border-white-2`
      : grey
        ? tw`border border-grey-2`
        : help
          ? tw`border border-blue-1`
          : tw`border border-transparent`

  return (
    <Pressable
      testID={testID}
      accessibilityLabel={typeof title === 'string' ? title + (disabled ? ' (disabled)' : '') : ''}
      onPress={onPressHandler}
      onPressIn={onPressInHandler}
      onPressOut={onPressOutHandler}
      cancelable={false}
      style={[
        tw`rounded w-full flex-row items-center justify-center px-3 py-2`,
        tw.md`p-3`,
        border,
        active ? bgColorActive : backgroundColor,
      ]}
    >
      {typeof title === 'string' ? (
        <Text style={[tw`font-baloo text-sm uppercase text-center w-full`, color, active ? tw`text-white-2` : {}]}>
          {!loading ? title : ''}
        </Text>
      ) : !loading ? (
        title
      ) : null}

      {loading ? <Loading size="small" style={tw`h-1 absolute`} color={color.color as string} /> : null}
    </Pressable>
  )
}

/**
 * @description Component to display the Button
 * @param props Component properties
 * @param props.title button text
 * @param [props.secondary] if true, button is of secondary nature
 * @param [props.tertiary] if true, button is of tertiary nature
 * @param [props.grey] if true, button is grey
 * @param [props.wide] if true, button is taking on 100% width
 * @param [props.style] css style object
 * @param [props.textColor] css style object for text color
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
  grey,
  help,
  red,
  textColor,
  bgColor,
  wide = true,
  style,
  testID,
  disabled,
  loading,
  onPress,
}: ButtonProps): ReactElement => {
  const viewStyle = [tw`rounded`, wide ? tw`w-full` : tw`w-40`, disabled ? tw`opacity-50` : {}, style || {}]

  return !secondary && !tertiary && !grey && !help ? (
    <Shadow shadow={mildShadowOrange} style={viewStyle}>
      <ButtonContent
        testID={testID}
        secondary={secondary}
        tertiary={tertiary}
        grey={grey}
        help={help}
        red={red}
        textColor={textColor}
        bgColor={bgColor}
        disabled={disabled}
        title={title}
        loading={loading}
        onPress={onPress}
      />
    </Shadow>
  ) : (
    <View style={viewStyle}>
      <ButtonContent
        testID={testID}
        secondary={secondary}
        tertiary={tertiary}
        grey={grey}
        help={help}
        red={red}
        textColor={textColor}
        bgColor={bgColor}
        disabled={disabled}
        title={title}
        loading={loading}
        onPress={onPress}
      />
    </View>
  )
}

export default Button
