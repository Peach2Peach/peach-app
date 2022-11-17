import React, { ReactElement, Ref, useState } from 'react'
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

type InputProps = ComponentProps &
  Omit<TextInputProps, 'onChange' | 'onSubmit' | 'onFocus' | 'onBlur'> & {
    label?: string
    icon?: IconType
    required?: boolean
    disabled?: boolean
    disableSubmit?: boolean
    disableOnEndEditing?: boolean
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
 * @param [props.icon] icon id
 * @param [props.multiline] if true, turns field into a text field
 * @param [props.autoCorrect] if true, enable autocorrect on input field
 * @param [props.disabled] if true, disable input field
 * @param [props.errorMessage] error message for invalid field
 * @param [props.onChange] onchange handler from outside
 * @param [props.onSubmit] onsubmit handler from outside
 * @param [props.onFocus] onFocus handler from outside
 * @param [props.onBlur] onBlur handler from outside
 * @param [props.secureTextEntry] if true hide input
 * @param [props.autoCapitalize] how to capitalize input automatically
 * @param [props.style] css style object
 * @example
 * <Input
 *   onChange={setAddress}
 *   value={address}
 *   label={i18n('form.address.btc')}
 *   isValid={!isFieldInError('address')}
 *   autoCorrect={false}
 *   errorMessage={getErrorsInField('address')}
 * />
 */
// eslint-disable-next-line max-lines-per-function, complexity
export const Input = ({
  value,
  label,
  placeholder,
  icon,
  required = true,
  multiline = false,
  autoCorrect = false,
  disabled = false,
  disableSubmit = false,
  disableOnEndEditing = false,
  errorMessage = [],
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  secureTextEntry,
  returnKeyType,
  autoCapitalize,
  style,
  testID,
  reference,
}: InputProps): ReactElement => {
  const [touched, setTouched] = useState(false)
  const showError = errorMessage.length > 0 && !disabled && touched
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
        <Text style={tw`input-label`}>
          {label}
          <Text style={tw`input-label font-medium text-black-2`}>{!required ? ` (${i18n('form.optional')})` : ''}</Text>
        </Text>
      ) : null}
      <View
        style={[
          tw`w-full flex flex-row items-center px-4 py-2 bg-primary-background-light overflow-hidden rounded-xl`,
          tw`border border-grey-4`,
          showError ? tw`border-2 border-error-main` : {},
          style ? style : {},
        ]}
      >
        <TextInput
          style={[
            tw`w-full h-full flex-shrink p-0 text-black-1 input-text`,
            !showError ? tw`border border-transparent` : {},
            multiline ? tw`pt-2` : {},
            !value ? tw`text-black-4` : {},
          ]}
          {...{
            testID,
            ref: reference ? reference : null,
            placeholder,
            placeholderTextColor: tw`text-black-4`.color,
            allowFontScaling: false,
            removeClippedSubviews: false,
            returnKeyType,
            value,
            editable: !disabled,
            multiline,
            textAlignVertical: 'top',
            onChangeText,
            onEndEditing,
            onSubmitEditing,
            blurOnSubmit: false,
            onFocus: onFocusHandler,
            onBlur: onBlurHandler,
            secureTextEntry,
            autoCorrect,
            autoCapitalize: autoCapitalize || 'none',
          }}
        />
        {icon ? (
          <Pressable
            testID={`${testID}-icon`}
            onPress={() => (onSubmit && !disableSubmit ? onSubmit(value) : null)}
            style={[tw`h-full absolute right-3 flex justify-center`, disableSubmit ? tw`opacity-50` : {}]}
          >
            <Icon id={icon} style={tw`w-5 h-5`} />
          </Pressable>
        ) : null}
      </View>

      <Text style={tw`tooltip text-error-main mt-1 ml-3`}>{showError ? errorMessage[0] : ' '}</Text>
    </View>
  )
}

export default Input
