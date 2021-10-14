import React, { ReactElement } from 'react'
import {
  Pressable,
  View
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import tw from '../../styles/tailwind'
import { ShadowFlex } from 'react-native-neomorph-shadows'
import Text from '../Text'
import Icon from '../Icon'

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
  icon?: string,
  autoCorrect?: boolean
  isValid?: boolean,
  errorMessage?: string[]
  onChange?: Function,
  onSubmit?: Function,
  secureTextEntry?: boolean
}

/**
 * @description Component to display an input field
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.label] input label
 * @param [props.icon] icon id
 * @param [props.autoCorrect] if true, enable autocorrect on input field
 * @param [props.isValid] if true show valid state
 * @param [props.errorMessage] error message for invalid field
 * @param [props.onChange] onchange handler from outside
 * @param [props.onSubmit] onsubmit handler from outside
 * @param [props.secureTextEntry] if true hide input
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
  isValid,
  errorMessage = [],
  onChange,
  onSubmit,
  secureTextEntry
}: InputProps): ReactElement => <View>
  <View style={[
    tw`flex h-10 border border-grey-2 rounded`,
    isValid && value ? tw`border-green` : {},
    errorMessage.length > 0 ? tw`border-red` : {}
  ]}>
    <ShadowFlex
      inner
      style={Object.assign(shadowStyle, tw`h-10 rounded`)}
    >
      <View style={tw`flex flex-row items-center justify-between pl-7 pr-3`}>
        <TextInput
          style={[tw`h-10 p-0 text-grey-1 text-lg`]}
          placeholder={label}
          value={value}
          autoCorrect={autoCorrect}
          onChangeText={(val: string) => onChange ? onChange(val) : null}
          onSubmitEditing={() => onSubmit ? onSubmit(value) : null}
          onBlur={() => onChange ? onChange(value?.trim()) : null}
          secureTextEntry={secureTextEntry}
        />
        {icon
          ? <Pressable onPress={() => onSubmit ? onSubmit(value) : null}>
            <Icon id="send" style={tw`w-5 h-5`} />
          </Pressable>
          : null
        }
      </View>
    </ShadowFlex>
  </View>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-2`}>{errorMessage[0]}</Text>
    : null
  }
</View>

export default Input