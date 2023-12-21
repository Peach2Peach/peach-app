import { TouchableOpacity } from 'react-native'
import tw from '../../styles/tailwind'
import { PeachText } from '../text/PeachText'
import { CopyAble } from '../ui/CopyAble'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  text: string
}

export const CopyableSummaryItem = ({ text, ...props }: Props) => (
  <SummaryItem {...props}>
    <TouchableOpacity style={tw`flex-row items-center justify-between gap-2`}>
      <PeachText style={tw`subtitle-1`}>{text}</PeachText>
      <CopyAble value={text} />
    </TouchableOpacity>
  </SummaryItem>
)
