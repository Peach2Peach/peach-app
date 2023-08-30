import { TouchableOpacity } from 'react-native'
import { FillProps } from 'react-native-svg'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { SimpleTimer } from '../text/Timer'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  end: number
  iconId?: IconType
  iconColor?: FillProps['fill']
  onPress?: () => void
}

export const TimerSummaryItem = ({ end, iconId, iconColor, onPress, ...props }: Props) => (
  <SummaryItem {...props}>
    <TouchableOpacity style={tw`flex-row items-center justify-between gap-2`} onPress={onPress} disabled={!onPress}>
      <SimpleTimer {...{ end }} style={tw`subtitle-1`}></SimpleTimer>
      {!!iconId && <Icon id={iconId} color={iconColor} size={16} />}
    </TouchableOpacity>
  </SummaryItem>
)
