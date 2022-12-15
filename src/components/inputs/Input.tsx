import React, { ReactElement, Ref, useMemo, useState } from 'react'
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputEndEditingEventData,
  TextInputProps,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { IconType } from '../icons'

const regularTheme = {
  label: tw`text-black-1`,
  text: tw`text-black-1`,
  textError: tw`text-black-1`,
  border: tw`border-black-1`,
  borderError: tw`border-error-main`,
  bg: tw`bg-primary-background-light`,
  bgError: tw`bg-primary-background-light`,
  error: tw`text-error-main`,
  placeholder: tw`text-black-4`,
  optional: tw`text-black-4`,
  isValid: tw`border-green`,
}
const invertedTheme = {
  label: tw`text-primary-background-light`,
  text: tw`text-primary-background-light`,
  textError: tw`text-error-main`,
  border: tw`border-primary-background-light`,
  borderError: tw`border-primary-background-light`,
  bg: tw`bg-transparent`,
  bgError: tw`bg-primary-background-light`,
  error: tw`text-primary-background-light`,
  placeholder: tw`text-primary-mild-1-4`,
  optional: tw`text-black-4`,
  isValid: tw`border-green`,
}

type IconActionPair = [IconType, () => void]
type InputProps = ComponentProps &
  Omit<TextInputProps, 'onChange' | 'onSubmit' | 'onFocus' | 'onBlur'> & {
    invertColors?: boolean
    label?: string
    icons?: IconActionPair[]
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
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.label] input label
 * @param [props.icons] array of icon components
 * @param [props.required] if true, field shows as required
 * @param [props.multiline] if true, turns field into a text field
 * @param [props.autoCorrect] if true, enable autocorrect on input field
 * @param [props.disabled] if true, disable input field
 * @param [props.isValid] if true show valid state
 * @param [props.errorMessage] error message for invalid field
 * @param [props.onChange] onchange handler from outside
 * @param [props.onSubmit] onsubmit handler from outside
 * @param [props.onFocus] onFocus handler from outside
 * @param [props.onBlur] onBlur handler from outside
 * @param [props.secureTextEntry] if true hide input
 * @param [props.autoCapitalize] how to capitalize input automatically
 * @param [props.style] css style object
 * @param [props.invertColors] if true invert color
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
  isValid,
  errorMessage = [],
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  onPressIn,
  secureTextEntry,
  returnKeyType,
  autoCapitalize,
  style,
  invertColors,
  testID,
  reference,
}: InputProps): ReactElement => {
  const colors = useMemo(() => (invertColors ? invertedTheme : regularTheme), [invertColors])
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
          <Text style={[tw`input-label font-medium`, colors.placeholder]}>
            {!required ? ` (${i18n('form.optional')})` : ''}
          </Text>
        </Text>
      ) : null}
      <View
        style={[
          tw`w-full flex flex-row items-center justify-between px-3`,
          tw`overflow-hidden rounded-xl border`,
          colors.bg,
          showError ? colors.bgError : {},
          colors.border,
          showError ? colors.borderError : {},
          showError ? tw`border-2` : {},
          isValid && value && !disabled ? colors.isValid : {},
          style ? style : {},
        ]}
      >
        <TextInput
          style={[
            tw`w-full h-10 flex-shrink input-text py-0 `,
            value ? colors.text : colors.placeholder,
            showError ? colors.textError : {},
            !showError ? tw`border border-transparent` : {},
            multiline ? tw`pt-2 h-full` : {},
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
          {inputIcons.map(([icon, action]) => (
            <Pressable onPress={action}>
              <Icon id={icon} style={tw`h-5 w-5 ml-4`} color={showError ? colors.textError.color : colors.text.color} />
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={[tw`tooltip mt-1 ml-3`, colors.error]}>{showError ? errorMessage[0] : ' '}</Text>
    </View>
  )
}

export default Input
