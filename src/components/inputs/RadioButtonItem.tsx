import { ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'

type Props = ComponentProps & {
  display: ReactNode
  isSelected: boolean
  onPress: () => void
  disabled?: boolean
}
export const RadioButtonItem = ({ display, isSelected, disabled, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      tw`flex-row items-center justify-between w-full px-4 py-2 border-2 bg-primary-background-dark rounded-xl`,
      disabled && tw`opacity-50`,
      isSelected ? tw`border-primary-main` : tw`border-transparent`,
    ]}
  >
    {typeof display === 'string' ? (
      <Text style={tw`flex-1 subtitle-1`}>{display}</Text>
    ) : (
      <View style={tw`flex-1`}>{display}</View>
    )}
    <Icon
      id={disabled ? 'minusCircle' : isSelected ? 'radioSelected' : 'circle'}
      style={tw`w-5 h-5`}
      color={(isSelected ? tw`text-primary-main` : tw`text-black-3`).color}
    />
  </TouchableOpacity>
)
