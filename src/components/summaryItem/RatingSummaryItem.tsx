import { Bubble } from '../bubble'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  rating: -1 | 1
}

export const RatingSummaryItem = ({ rating, ...props }: Props) => (
  <SummaryItem {...props}>
    <Bubble color="primary" ghost iconId={rating === 1 ? 'thumbsUp' : 'thumbsDown'} iconSize={12} />
  </SummaryItem>
)
