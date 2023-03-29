import { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from '..'
import tw from '../../styles/tailwind'
import { Text } from '../text'

export type CheckboxType = {
  value: string | number
  disabled?: boolean
  display: ReactNode
}

type CheckboxProps = ComponentProps & {
  onPress: () => void
  item: CheckboxType
  checked: boolean
  editing: boolean
}
export const PaymentDetailsCheckbox = ({
  item,
  checked,
  onPress,
  style,
  testID,
  editing,
}: CheckboxProps): ReactElement => (
  <Pressable
    testID={testID}
    onPress={onPress}
    style={[
      tw`flex-row items-center justify-between w-full px-3 py-2 border-2 bg-primary-background-dark rounded-xl`,
      checked && !item.disabled && !editing ? tw`border-primary-main` : tw`border-transparent`,
      style,
    ]}
  >
    <Text style={tw`flex-1`}>{item.display}</Text>
    {!item.disabled ? (
      <View style={tw`flex items-center justify-center w-5 h-5 ml-4`}>
        {editing ? (
          <Icon id={'edit3'} color={tw`text-primary-main`.color} />
        ) : checked ? (
          <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
        ) : (
          <View style={tw`w-4 h-4 border-2 rounded-sm border-black-3`} />
        )}
      </View>
    ) : (
      <View style={tw`w-5 h-5 ml-4`} />
    )}
  </Pressable>
)
