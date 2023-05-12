import tw from '../../styles/tailwind'
import { getTradeStatusIcon } from './getTradeStatusIcon'
import { getTradeStatusText } from './getTradeStatusText'
import { TradeSeparator } from './TradeSeparator'

type Props = ComponentProps & Pick<Contract, 'disputeActive' | 'tradeStatus'>

export const TradeStatus = ({ style, disputeActive, tradeStatus }: Props) => (
  <TradeSeparator
    {...{ style, disputeActive }}
    iconId={getTradeStatusIcon(disputeActive, tradeStatus)}
    text={getTradeStatusText(disputeActive, tradeStatus)}
    iconColor={tradeStatus === 'confirmPaymentRequired' ? tw.color('black-2') : undefined}
  />
)
