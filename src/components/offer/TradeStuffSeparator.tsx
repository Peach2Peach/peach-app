import i18n from '../../utils/i18n'
import { Divider } from '../Divider'

type Props = {
  disputeActive: boolean
} & ComponentProps

export const TradeStuffSeparator = ({ disputeActive, style }: Props) => (
  <Divider style={style} text={i18n('trade.tradeStuff')} type={disputeActive ? 'error' : 'light'} />
)
