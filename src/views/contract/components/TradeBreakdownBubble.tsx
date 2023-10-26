import { Bubble } from '../../../components/bubble'
import { TradeBreakdownPopup } from '../../../popups/TradeBreakdownPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'

export function TradeBreakdownBubble ({ contract }: { contract: Contract }) {
  const setPopup = usePopupStore((state) => state.setPopup)
  const showTradeBreakdown = () => setPopup(<TradeBreakdownPopup contract={contract} />)

  return (
    <Bubble iconId="info" color="primary" onPress={showTradeBreakdown}>
      {i18n('contract.summary.tradeBreakdown.show')}
    </Bubble>
  )
}
