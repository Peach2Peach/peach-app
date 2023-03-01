import React, { ReactElement, Ref, useEffect, useMemo, useState } from 'react'
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputEndEditingEventData,
  TextInputProps,
  TextInputSubmitEditingEventData,
  View,
  ViewStyle,
} from 'react-native'
import { Color } from 'react-native-svg'

import { Text } from '..'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'

const themes = {
  default: {
    label: tw`text-black-1`,
    text: tw`text-black-1`,
    textError: tw`text-black-1`,
    border: tw`border-black-1`,
    borderError: tw`border-error-main`,
    borderDisabled: tw`text-black-2`,
    bg: tw`bg-primary-background-light`,
    bgError: tw`bg-primary-background-light`,
    bgDisabled: tw`bg-transparent`,
    error: tw`text-error-main`,
    placeholder: tw`text-black-4`,
    optional: tw`text-black-4`,
  },
  inverted: {
    label: tw`text-primary-background-light`,
    text: tw`text-primary-background-light`,
    textError: tw`text-error-main`,
    border: tw`border-primary-background-light`,
    borderError: tw`border-primary-background-light`,
    borderDisabled: tw`border-primary-background-light`,
    bg: tw`bg-transparent`,
    bgError: tw`bg-primary-background-light`,
    bgDisabled: tw`bg-transparent`,
    error: tw`text-primary-background-light`,
    placeholder: tw`text-primary-mild-1`,
    optional: tw`text-black-4`,
  },
}

type IconActionPair = [IconType, () => void]
export type InputProps = ComponentProps &
  Omit<TextInputProps, 'onChange' | 'onEndEditing' | 'onSubmit' | 'onFocus' | 'onBlur'> & {
    theme?: 'default' | 'inverted'
    label?: string
    icons?: IconActionPair[]
    iconColor?: Color
    inputStyle?: ViewStyle | ViewStyle[]
    required?: boolean
    disabled?: boolean
    disableSubmit?: boolean
    errorMessage?: string[]
    onChange?: Function
    onEndEditing?: Function
    onSubmit?: Function
    onFocus?: Function
    onBlur?: Function
    reference?: Ref<TextInput>
    enforceRequired?: boolean
    oneLineErrors?: boolean
  }

/**
 * @description Component to display an input field
 * @example
 * <Input
 *   onChange={setAddress}
 *   value={address}
 *   label={i18n('form.address.btc')}
 *   autoCorrect={false}
 *   errorMessage={getErrorsInField('address')}
 * />
 */
// eslint-disable-next-line max-lines-per-function, complexity
export const Input = ({
  value,
  label,
  icons = [],
  iconColor,
  required = true,
  multiline = false,
  disabled = false,
  disableSubmit = false,
  errorMessage = [],
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  onEndEditing,
  onPressIn,
  secureTextEntry,
  autoCapitalize,
  autoCorrect = false,
  style,
  inputStyle,
  enforceRequired = false,
  theme = 'default',
  reference,
  oneLineErrors = false,
  ...inputProps
}: InputProps): ReactElement => {
  const colors = useMemo(() => themes[theme], [theme])
  const [touched, setTouched] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const showError = errorMessage.length > 0 && !disabled && touched
  const toggleShowSecret = () => setShowSecret((b) => !b)
  const inputIcons: IconActionPair[] = useMemo(
    () => (secureTextEntry ? [...icons, [showSecret ? 'eyeOff' : 'eye', toggleShowSecret]] : icons),
    [icons, secureTextEntry, showSecret],
  )

  useEffect(() => {
    if (value) setTouched(true)
  }, [value])

  const onChangeText = (val: string) => {
    if (onChange) onChange(val)
  }
  const onEndEditingHandler = onEndEditing
    ? (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      onEndEditing(e.nativeEvent.text?.trim())
      setTouched(true)
    }
    : () => null
  const onSubmitEditing
    = onSubmit && !disableSubmit
      ? (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        onSubmit(e.nativeEvent.text?.trim())
        setTouched(true)
      }
      : () => null
  const onFocusHandler = () => (onFocus ? onFocus() : null)
  const onBlurHandler = () => {
    if (onChange && value) onChange(value.trim())
    if (onBlur) onBlur(value)
  }

  return (
    <View>
      {!!label && (
        <Text style={[tw`pl-2 input-label`, colors.text]}>
          {label}
          <Text style={[tw`font-medium input-label`, colors.placeholder]}>
            {!required ? ` (${i18n('form.optional')})` : enforceRequired ? ` (${i18n('form.required')})` : ''}
          </Text>
        </Text>
      )}
      <View
        style={[
          tw`flex flex-row items-center justify-between w-full px-3`,
          tw`overflow-hidden border rounded-xl`,
          disabled ? colors.bgDisabled : colors.bg,
          disabled ? colors.borderDisabled : colors.border,
          showError && colors.bgError,
          showError && colors.borderError,
          style,
        ]}
      >
        <TextInput
          style={[
            tw`flex-shrink w-full h-10 py-0 input-text`,
            value ? colors.text : colors.placeholder,
            showError && colors.textError,
            !showError && tw`border border-transparent`,
            multiline && tw`flex justify-start h-full pt-2`,
            !!inputStyle && inputStyle,
          ]}
          {...{
            value,
            ref: reference ? reference : null,
            placeholderTextColor: colors.placeholder.color,
            allowFontScaling: false,
            removeClippedSubviews: false,
            editable: !disabled,
            onChangeText,
            multiline,
            textAlignVertical: multiline ? 'top' : 'center',
            onEndEditing: onEndEditingHandler,
            onSubmitEditing,
            blurOnSubmit: false,
            onFocus: onFocusHandler,
            onBlur: onBlurHandler,
            onPressIn,
            secureTextEntry: secureTextEntry && !showSecret,
            autoCapitalize: autoCapitalize || 'none',
            autoCorrect,
            ...inputProps,
          }}
        />
        <View style={tw`flex flex-row`}>
          {inputIcons.map(([icon, action], index) => (
            <Pressable onPress={action} key={`inputIcon-${icon}-${index}`}>
              <Icon
                id={icon}
                style={tw`w-5 h-5 ml-4`}
                color={!!iconColor ? iconColor : showError ? colors.textError.color : colors.text.color}
              />
            </Pressable>
          ))}
        </View>
      </View>
      <Text numberOfLines={oneLineErrors ? 1 : undefined} style={[tw`mt-1 ml-3 tooltip`, colors.error]}>
        {showError ? errorMessage[0] : ' '}
      </Text>
    </View>
  )
}

export default Input
