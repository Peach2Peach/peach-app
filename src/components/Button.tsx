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
  activeBgColor?: Style
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
  activeBgColor,
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
  const bgColorActive = activeBgColor ? activeBgColor : grey ? tw`bg-grey-2` : tw`bg-peach-2`
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
export const OldButton = ({
  title,
  secondary,
  tertiary,
  grey,
  help,
  red,
  textColor,
  bgColor,
  wide = true,
  activeBgColor,
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
        activeBgColor={activeBgColor}
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
        activeBgColor={activeBgColor}
        title={title}
        loading={loading}
        onPress={onPress}
      />
    </View>
  )
}

type DefaultButton = {
  title?: string
  info?: true
  border?: boolean
  disabled?: boolean
  wide?: true
  narrow?: true
  option?: boolean
  children: React.ReactNode
  noBackground?: true
  icon?: true
}
type newButtonProps = DefaultButton

/**
 *  type:
 *    -primary
 *    -info
 *    -option
 *
 *  icon
 *  border
 *  backgroundcolor
 *
 *  width:
 *    -fixed
 *      --small
 *      --wide
 *    -relative
 */
/**
 * Abstractions:
 *  Option button will always have an icon on the left
 *  will always have a border with white background
 *
 * only buttons that can be disabled are primary ones
 * only buttons that can have icon left are option
 */

type IconButton = { title: string; icon?: true } | { icon: true; title?: string }
type BorderButton = { border: true }
type PrimaryButton = { title?: string; width: 'fixed' | 'relative'; wide?: boolean }

// eslint-disable-next-line complexity
export const Button = ({ title, info, disabled, wide, option, children, border, icon, narrow }: DefaultButton) => {
  const color
    = border || option
      ? tw`bg-primary-background-light`
      : info
        ? tw`bg-info-light`
        : disabled
          ? tw`bg-primary-mild-2`
          : tw`bg-primary-light`
  const width = icon && !title && !children ? tw`w-12` : wide ? tw`w-57` : narrow ? tw`w-39` : undefined
  const textColor = border
    ? info
      ? tw`text-info-light`
      : tw`text-primary-light`
    : option
      ? tw`text-[#7D675E]`
      : tw`text-primary-background-light`

  const borderColor = option ? tw`border-[#7D675E]` : info ? tw`border-info-light` : tw`border-primary-light`
  const iconSize = !title && !children ? tw`w-6 h-6` : tw`w-4 h-4`

  return (
    <Pressable
      style={[
        color,
        width,
        tw`flex-row items-center justify-center h-10 rounded-full px-4`,
        (option || border) && [tw`border-2`, borderColor],
      ]}
    >
      {!!option && <View style={tw`w-4 h-4 border-2 border-[#7D675E]`} />}
      {(title || children) && <Text style={[textColor, tw`button-medium px-2`]}>{title ?? children}</Text>}
      {!!icon && <View style={[tw`border-[#7D675E] border-[1px]`, iconSize]} />}
    </Pressable>
  )
}

export default Button
