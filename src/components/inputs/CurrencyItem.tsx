import { Pressable } from 'react-native'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { Text } from '../text'

type ItemProps = ComponentProps & {
  label: string
  isSelected: boolean
  onPress: () => void
}
export const CurrencyItem = ({ label, isSelected, onPress, style }: ItemProps) => {
  const bgColor = isSelected ? tw`bg-primary-main` : {}
  const borderColor = isSelected ? tw`border-primary-main` : tw`border-black-3`
  const textColor = tw.color(isSelected ? 'primary-background-light' : 'black-3')

  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`flex-row items-center justify-between px-2 border rounded-lg w-15 border-black-3`,
        bgColor,
        borderColor,
        style,
      ]}
    >
      <Text style={[tw`button-medium`, { color: textColor }]}>{label}</Text>
      <Icon id={isSelected ? 'minusCircle' : 'plusCircle'} color={textColor} style={tw`w-3 h-3`} />
    </Pressable>
  )
}
