import React, { ReactElement, Ref } from 'react'
import {
  NativeSyntheticEvent,
  Pressable, TextInput,
  TextInputEndEditingEventData,
  TextInputProps,
  TextInputSubmitEditingEventData,
  View
} from 'react-native'
import { Shadow, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { innerShadow } from '../../utils/layout'
import Icon from '../Icon'
import { IconType } from '../icons'

type InputProps = ComponentProps
  & Omit<TextInputProps, 'onChange' | 'onSubmit' |'onFocus' | 'onBlur'>
  & {
  label?: string
  icon?: IconType
  required?: boolean
  disabled?: boolean
  disableSubmit?: boolean
  disableOnEndEditing?: boolean
  isValid?: boolean
  hint?: string
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
 * @param [props.isValid] if true show valid state
 * @param [props.hint] hint
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
  label, placeholder, hint, icon,
  required = true,
  multiline = false,
  autoCorrect = false,
  disabled = false,
  disableSubmit = false,
  disableOnEndEditing = false,
  isValid,
  errorMessage = [],
  onChange, onSubmit,
  onFocus, onBlur,
  secureTextEntry,
  returnKeyType,
  autoCapitalize,
  style,
  testID,
  reference
}: InputProps): ReactElement => {
  const onChangeText = (val: string) => onChange ? onChange(val) : null
  const onSubmitEditing = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) =>
    onSubmit && !disableSubmit ? onSubmit(e.nativeEvent.text?.trim()) : null
  const onEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) =>
    onChange && !disableOnEndEditing ? onChange(e.nativeEvent.text?.trim()) : null
  const onFocusHandler = () => onFocus ? onFocus() : null
  const onBlurHandler = () => {
    if (onChange && value) onChange(value.trim())
    if (onBlur) onBlur()
  }

  return <View>
    {label
      ? <Text style={tw`font-baloo text-lg`}>
        {label}{!required ? ` (${i18n('form.optional')})` : ''}
      </Text>
      : null
    }
    <View style={tw`overflow-hidden rounded`}>
      <Shadow shadow={innerShadow} style={[
        tw`w-full flex flex-row items-center h-8 border border-grey-4 rounded pl-4 pr-3 bg-white-1`,
        tw.md`h-10`,
        icon ? tw`pr-12` : {},
        style ? style : {},
        isValid && value && !disabled ? tw`border-green` : {},
        errorMessage.length > 0 && !disabled ? tw`border-red` : {},
      ]}>
        <TextInput testID={testID} ref={reference ? reference : null}
          style={[
            tw`w-full flex-shrink h-8 p-0 text-grey-1 font-lato text-lg leading-5`,
            tw.md`h-10`,
            multiline ? tw`h-full pt-2` : {},
            label && !value ? tw`font-baloo text-xs leading-5 uppercase text-grey-1` : {}
          ]}
          placeholder={placeholder}
          placeholderTextColor={tw`text-grey-2`.color as string}
          allowFontScaling={false}
          removeClippedSubviews={false}
          returnKeyType={returnKeyType}
          value={value}
          editable={!disabled} autoCorrect={autoCorrect}
          multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={false}
          onFocus={onFocusHandler} onBlur={onBlurHandler}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize || 'none'}
        />
        {icon
          ? <Pressable testID={`${testID}-icon`} onPress={() => onSubmit && !disableSubmit ? onSubmit(value) : null}
            style={[tw`h-full absolute right-3 flex justify-center`, disableSubmit ? tw`opacity-50` : {}]}>
            <Icon id={icon} style={tw`w-5 h-5`} />
          </Pressable>
          : null
        }
      </Shadow>
    </View>

    {errorMessage.length > 0 && errorMessage[0]
      ? <Text style={tw`font-baloo text-xs text-red text-center mt-1`}>{errorMessage[0]}</Text>
      : null
    }
    {hint && errorMessage.length === 0 && errorMessage[0]
      ? <Text style={tw`font-baloo text-xs text-grey-3 text-center mt-1`}>{hint}</Text>
      : null
    }
  </View>
}

export default Input