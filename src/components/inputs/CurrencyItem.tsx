import { ReactElement } from 'react'
import { Pressable } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

type ItemProps = ComponentProps & {
  label: string
  isSelected: boolean
  onPress: () => void
}
export const CurrencyItem = ({ label, isSelected, onPress, style }: ItemProps): ReactElement => {
  const bgColor = isSelected ? tw`bg-primary-main` : {}
  const borderColor = isSelected ? tw`border-primary-main` : tw`border-black-3`
  const textColor = isSelected ? tw`text-primary-background-light` : tw`text-black-3`

  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`flex-row items-center justify-center flex-shrink border rounded-lg border-black-3`,
        bgColor,
        borderColor,
        style,
      ]}
    >
      <Text style={[tw`px-2 button-medium`, textColor]}>{label}</Text>
      <Icon id={isSelected ? 'minusCircle' : 'plusCircle'} color={textColor.color} style={tw`w-3 h-3 mr-2`} />
    </Pressable>
  )
}
