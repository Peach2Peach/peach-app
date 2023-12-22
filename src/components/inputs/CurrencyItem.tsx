import { Pressable } from 'react-native'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'

type ItemProps = ComponentProps & {
  label: string
  isSelected: boolean
  onPress: () => void
}
export const CurrencyItem = ({ label, isSelected, onPress, style }: ItemProps) => {
  const bgColor = isSelected ? tw`bg-primary-main` : {}
  const borderColor = isSelected ? tw`border-primary-main` : tw`border-black-50`
  const textColor = tw.color(isSelected ? 'primary-background-light' : 'black-50')

  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`flex-row items-center justify-between px-2 border rounded-lg w-15 border-black-50`,
        bgColor,
        borderColor,
        style,
      ]}
    >
      <PeachText style={[tw`button-medium`, { color: textColor }]}>{label}</PeachText>
      <Icon id={isSelected ? 'minusCircle' : 'plusCircle'} color={textColor} style={tw`w-3 h-3`} />
    </Pressable>
  )
}
