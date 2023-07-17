import { FillProps } from 'react-native-svg'
import { SummaryItem, SummaryItemProps } from './SummaryItem'
import { Text } from '../text'
import { Icon } from '../Icon'
import { IconType } from '../../assets/icons'
import { TouchableOpacity } from 'react-native'
import tw from '../../styles/tailwind'

type Props = SummaryItemProps & {
  text: string
  iconId?: IconType
  iconColor?: FillProps['fill']
  onPress?: () => void
}

export const TextSummaryItem = ({ text, iconId, iconColor, onPress, ...props }: Props) => (
  <SummaryItem {...props}>
    <TouchableOpacity style={tw`flex-row items-center justify-between gap-2`} onPress={onPress} disabled={!onPress}>
      <Text style={tw`subtitle-1`}>{text}</Text>
      {!!iconId && <Icon id={iconId} color={iconColor} size={16} />}
    </TouchableOpacity>
  </SummaryItem>
)
