import React, { ReactElement, Ref, useMemo, useState } from 'react'
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
import { Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { IconType } from '../../assets/icons'

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
  Omit<TextInputProps, 'onChange' | 'onSubmit' | 'onFocus' | 'onBlur'> & {
    theme?: 'default' | 'inverted'
    label?: string
    icons?: IconActionPair[]
    inputStyle: ViewStyle | ViewStyle[]
    required?: boolean
    disabled?: boolean
    disableSubmit?: boolean
    disableOnEndEditing?: boolean
    isValid?: boolean
    errorMessage?: string[]
    onChange?: Function
    onSubmit?: Function
    onFocus?: Function
    onBlur?: Function
    reference?: Ref<TextInput>
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
  placeholder,
  icons = [],
  required = true,
  multiline = false,
  autoCorrect = false,
  disabled = false,
  disableSubmit = false,
  disableOnEndEditing = false,
  errorMessage = [],
  maxLength,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  onPressIn,
  secureTextEntry,
  returnKeyType,
  autoCapitalize,
  style,
  inputStyle,
  theme = 'default',
  testID,
  reference,
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

  const onChangeText = (val: string) => (onChange ? onChange(val) : null)
  const onSubmitEditing
    = onSubmit && !disableSubmit
      ? (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        onSubmit(e.nativeEvent.text?.trim())
        setTouched(true)
      }
      : () => null
  const onEndEditing
    = onChange && !disableOnEndEditing
      ? (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        onChange(e.nativeEvent.text?.trim())
        setTouched(true)
      }
      : () => null
  const onFocusHandler = () => (onFocus ? onFocus() : null)
  const onBlurHandler = () => {
    if (onChange && value) onChange(value.trim())
    if (onBlur) onBlur()
  }

  return (
    <View>
      {label ? (
        <Text style={[tw`input-label`, colors.text]}>
          {label}
          <Text style={[tw`font-medium input-label`, colors.placeholder]}>
            {!required ? ` (${i18n('form.optional')})` : ''}
          </Text>
        </Text>
      ) : null}
      <View
        style={[
          tw`flex flex-row items-center justify-between w-full px-3`,
          tw`overflow-hidden border rounded-xl`,
          disabled ? colors.bgDisabled : colors.bg,
          disabled ? colors.borderDisabled : colors.border,
          showError ? colors.bgError : {},
          showError ? colors.borderError : {},
          showError ? tw`border-2` : {},
          style ? style : {},
        ]}
      >
        <TextInput
          style={[
            tw`flex-shrink w-full h-10 py-0 input-text`,
            value ? colors.text : colors.placeholder,
            showError ? colors.textError : {},
            !showError ? tw`border border-transparent` : {},
            multiline ? tw`h-full pt-2` : {},
            inputStyle ? inputStyle : {},
          ]}
          {...{
            testID,
            ref: reference ? reference : null,
            placeholder,
            placeholderTextColor: colors.placeholder.color,
            allowFontScaling: false,
            removeClippedSubviews: false,
            returnKeyType,
            value,
            editable: !disabled,
            multiline,
            onChangeText,
            maxLength,
            textAlignVertical: multiline ? 'top' : 'center',
            onEndEditing,
            onSubmitEditing,
            blurOnSubmit: false,
            onFocus: onFocusHandler,
            onBlur: onBlurHandler,
            onPressIn,
            secureTextEntry: secureTextEntry && !showSecret,
            autoCorrect,
            autoCapitalize: autoCapitalize || 'none',
          }}
        />
        <View style={tw`flex flex-row`}>
          {inputIcons.map(([icon, action], index) => (
            <Pressable onPress={action} key={`inputIcon-${icon}-${index}`}>
              <Icon id={icon} style={tw`w-5 h-5 ml-4`} color={showError ? colors.textError.color : colors.text.color} />
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={[tw`mt-1 ml-3 tooltip`, colors.error]}>{showError ? errorMessage[0] : ' '}</Text>
    </View>
  )
}

export default Input
