import React, { ReactElement } from 'react'
import {
  Text,
  View
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import tw from '../../styles/tailwind'


interface InputProps {
  value?: string,
  label?: string,
  placeholder?: string,
  autoCorrect?: boolean
  isValid: boolean,
  errorMessage?: string[]
  onChange: Function
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.value current value
 * @param props.label input label
 * @param props.placeholder placeholder text for no value
 * @param props.autoCorrect if true, enable autocorrect on input field
 * @param props.isValid if true show valid state
 * @param props.errorMessage error message for invalid field
 * @param props.onChange onchange handler from outside
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
export default ({
  value,
  label,
  placeholder,
  autoCorrect = false,
  isValid,
  errorMessage = [],
  onChange
}: InputProps): ReactElement => <View>
  {label
    ? <Text style={[
      isValid && value ? tw`text-green` : null,
      errorMessage.length > 0 ? tw`text-red` : null
    ]}>{label}</Text>
    : null
  }
  <TextInput
    style={[
      tw`border p-2`,
      isValid && value ? tw`border-green` : null,
      errorMessage.length > 0 ? tw`border-red` : null
    ]}
    placeholder={placeholder}
    value={value}
    autoCorrect={autoCorrect}
    onChangeText={(val: string) => onChange(val)}
    onBlur={event => onChange(event.nativeEvent.text.trim())}

  />
  {errorMessage.length > 0
    ? <Text style={tw`text-red`}>{errorMessage[0]}</Text>
    : null
  }
</View>