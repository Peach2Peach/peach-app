import React, { ReactElement } from 'react'
import {
  View
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import tw from '../../styles/tailwind'
import { ShadowFlex } from 'react-native-neomorph-shadows'
import Text from '../Text'

const shadowStyle = {
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: 0.25,
  shadowColor: '#000000',
  shadowRadius: 4,
  backgroundColor: 'transparent'
}
interface InputProps {
  value?: string,
  label?: string,
  placeholder?: string,
  autoCorrect?: boolean
  isValid?: boolean,
  errorMessage?: string[]
  onChange?: Function
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.label] input label
 * @param [props.placeholder] placeholder text for no value
 * @param [props.autoCorrect] if true, enable autocorrect on input field
 * @param [props.isValid] if true show valid state
 * @param [props.errorMessage] error message for invalid field
 * @param [props.onChange] onchange handler from outside
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
      tw`text-center text-black-1`,
      isValid && value ? tw`text-green` : {},
      errorMessage.length > 0 ? tw`text-red` : {}
    ]}>{label}</Text>
    : null
  }
  <View style={[
    tw`flex h-10 border border-grey-2 rounded`,
    isValid && value ? tw`border-green` : {},
    errorMessage.length > 0 ? tw`border-red` : {}
  ]}>
    <ShadowFlex
      inner
      style={Object.assign(shadowStyle, tw`h-10 rounded`)}
    >
      <TextInput
        style={[tw`h-10 p-2 text-grey-1 text-lg`]}
        placeholder={placeholder}
        value={value}
        autoCorrect={autoCorrect}
        onChangeText={(val: string) => onChange ? onChange(val) : null}
        onBlur={() => onChange ? onChange(value?.trim()) : null}
      />
    </ShadowFlex>
  </View>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-2`}>{errorMessage[0]}</Text>
    : null
  }
</View>