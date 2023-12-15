import { TouchableOpacity } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'
import { CopyAble } from '../ui/CopyAble'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  text: string
}

export const CopyableSummaryItem = ({ text, ...props }: Props) => (
  <SummaryItem {...props}>
    <TouchableOpacity style={tw`flex-row items-center justify-between gap-2`}>
      <Text style={tw`subtitle-1`}>{text}</Text>
      <CopyAble value={text} />
    </TouchableOpacity>
  </SummaryItem>
)
