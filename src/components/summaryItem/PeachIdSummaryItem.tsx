import { UserId } from '../../views/settings/profile/profileOverview/components'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  id: string
}

export const PeachIdSummaryItem = ({ id, ...props }: Props) => (
  <SummaryItem {...props}>
    <UserId id={id} showInfo />
  </SummaryItem>
)
