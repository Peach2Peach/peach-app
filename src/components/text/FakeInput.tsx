import React, { ReactElement } from 'react'
import {
  Pressable,
  View,
  ViewStyle
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '..'
import { Shadow } from 'react-native-shadow-2'
import { innerShadow } from '../../utils/layoutUtils'

interface FakeInputProps {
  value?: string,
  label?: string,
  icon?: string,
  isValid?: boolean,
  errorMessage?: string[],
  style?: ViewStyle|ViewStyle[]
}

/**
 * @description Component to display a fake input field
 * @param props Component properties
 * @param [props.value] current value
 * @param [props.label] input label
 * @param [props.icon] icon id
 * @param [props.isValid] if true show valid state
 * @param [props.errorMessage] error message for invalid field
 * @param [props.style] css style object
 * @example
 * <FakeInput
 *   value={address}
 *   label={i18n('form.btcAddress')}
 *   isValid={!isFieldInError('address')}
 *   errorMessage={getErrorsInField('address')}
 * />
 */
export const FakeInput = ({
  value,
  label,
  icon,
  isValid,
  errorMessage = [],
  style,
}: FakeInputProps): ReactElement => <View>
  <View style={tw`overflow-hidden rounded`}>
    <Shadow {...innerShadow} viewStyle={[
      tw`w-full flex flex-row items-center h-10 border border-grey-4 rounded pl-7 pr-3`,
      style ? style : {},
      isValid && value ? tw`border-green` : {},
      errorMessage.length > 0 ? tw`border-red` : {},
    ]}>
      <Text style={[tw`w-full flex-shrink p-0 text-grey-1 text-lg leading-5`]} numberOfLines={1} ellipsizeMode="middle">
        {value || label}
      </Text>
      {icon
        ? <Icon id="send" style={tw`w-5 h-5`} />
        : null
      }
    </Shadow>
  </View>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-2`}>{errorMessage[0]}</Text>
    : null
  }
</View>

export default FakeInput