import i18n from '../../../utils/i18n'
import { useContractContext } from '../context'
import { Divider } from '../../../components/Divider'

export const TradeStuffSeparator = ({ style }: ComponentProps) => {
  const { disputeActive } = useContractContext().contract
  return <Divider style={style} text={i18n('trade.tradeStuff')} type={disputeActive ? 'error' : 'light'} />
}
