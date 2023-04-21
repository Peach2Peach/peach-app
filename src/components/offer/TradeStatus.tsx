import i18n from '../../utils/i18n'
import { TradeSeparator } from './TradeSeparator'

export type Props = ComponentProps & {
  disputeActive: boolean
}

export const TradeStatus = ({ style, disputeActive }: Props) => (
  <TradeSeparator
    {...{ style, disputeActive }}
    iconId={'alertOctagon'}
    text={i18n(disputeActive ? 'trade.disputeActive' : 'trade.paymentDetails')}
  />
)
