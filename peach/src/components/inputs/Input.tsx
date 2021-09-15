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
  isValid: boolean,
  errorMessage?: string[]
  onChange: Function
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.value current value
 * @param props.label input label
 * @param props.placeholder placholder text for no value
 * @param props.isValid if true show valid state
 * @param props.errorMessage error message for invalid field
 * @param props.onChange onchange handler from outside
 * @returns {ReactElement}
 */
export default ({ value, label, placeholder, isValid, errorMessage = [], onChange }: InputProps): ReactElement => <View>
  {label
    ? <Text style={[
      isValid && value ? tw`text-green-600` : null,
      errorMessage.length > 0 ? tw`text-red-600` : null
    ]}>{label}</Text>
    : null
  }
  <TextInput
    style={[
      tw`border p-2`,
      isValid && value ? tw`border-green-600` : null,
      errorMessage.length > 0 ? tw`border-red-600` : null
    ]}
    placeholder={placeholder}
    value={value}
    onChangeText={(val: string) => onChange(val.trim())}
  />
  {errorMessage.length > 0
    ? <Text style={tw`text-red-600`}>{errorMessage[0]}</Text>
    : null
  }
</View>