import React, { ReactElement, Ref } from 'react'
import {
  Pressable,
  TextInput,
  View,
} from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '..'
import { Shadow } from 'react-native-shadow-2'
import { innerShadow } from '../../utils/layout'

type InputProps = ComponentProps & {
  value?: string,
  label?: string,
  icon?: string,
  autoCorrect?: boolean
  disabled?: boolean
  isValid?: boolean,
  hint?: string
  errorMessage?: string[]
  onChange?: Function,
  onSubmit?: Function,
  onFocus?: Function,
  onBlur?: Function,
  secureTextEntry?: boolean,
  reference?: Ref<TextInput>,
}

/**
 * @description Component to display an input field
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.label] input label
 * @param [props.icon] icon id
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
 * @param [props.style] css style object
 * @example
 * <Input
 *   onChange={setAddress}
 *   value={address}
 *   label={i18n('form.btcAddress')}
 *   isValid={!isFieldInError('address')}
 *   autoCorrect={false}
 *   errorMessage={getErrorsInField('address')}
 * />
 */
export const Input = ({
  value,
  label,
  icon,
  autoCorrect = false,
  disabled = false,
  isValid,
  hint,
  errorMessage = [],
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  secureTextEntry,
  style,
  reference
}: InputProps): ReactElement => <View>
  <View style={tw`overflow-hidden rounded`}>
    <Shadow {...innerShadow} viewStyle={[
      tw`w-full flex flex-row items-center h-8 border border-grey-4 rounded pl-4 pr-3 bg-white-1`,
      tw.md`h-10`,
      style ? style : {},
      isValid && value && !disabled ? tw`border-green` : {},
      errorMessage.length > 0 && !disabled ? tw`border-red` : {},
    ]}>
      <TextInput ref={reference ? reference : null}
        style={[
          tw`w-full flex-shrink h-8 p-0 text-grey-1 text-lg leading-5`,
          tw.md`h-10`,
          label && !value ? tw`font-baloo text-xs uppercase` : {}
        ]}
        placeholder={label}
        value={value}
        editable={!disabled}
        autoCorrect={autoCorrect}
        onChangeText={(val: string) => onChange ? onChange(val) : null}
        onSubmitEditing={(e) => onSubmit ? onSubmit(e.nativeEvent.text?.trim()) : null}
        onEndEditing={(e) => onChange ? onChange(e.nativeEvent.text?.trim()) : null}
        onFocus={() => onFocus ? onFocus() : null}
        onBlur={() => onBlur ? onBlur() : null}
        secureTextEntry={secureTextEntry}
      />
      {icon
        ? <Pressable onPress={() => onSubmit ? onSubmit(value) : null}>
          <Icon id={icon} style={tw`w-5 h-5`} />
        </Pressable>
        : null
      }
    </Shadow>
  </View>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-1`}>{errorMessage[0]}</Text>
    : null
  }
  {hint && errorMessage.length === 0
    ? <Text style={tw`font-baloo text-xs text-grey-3 text-center mt-1`}>{hint}</Text>
    : null
  }
</View>

export default Input