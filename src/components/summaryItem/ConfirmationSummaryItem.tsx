import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SummaryItemProps } from './SummaryItem'
import { TextSummaryItem } from './TextSummaryItem'

type Props = Omit<SummaryItemProps, 'title'> & {
  confirmed?: boolean
}

export const ConfirmationSummaryItem = ({ confirmed, ...props }: Props) => (
  <TextSummaryItem
    {...props}
    title={i18n('status')}
    text={i18n(`wallet.transaction.${confirmed ? 'confirmed' : 'pending'}`)}
    iconId={confirmed ? 'checkCircle' : 'clock'}
    iconColor={confirmed ? tw.color('success-main') : tw.color('black-3')}
  />
)
