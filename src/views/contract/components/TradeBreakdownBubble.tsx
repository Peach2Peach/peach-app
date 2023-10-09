import { NETWORK } from '@env'
import { Bubble } from '../../../components/bubble'
import { PopupAction } from '../../../components/popup'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { TradeBreakdown } from '../../../popups/TradeBreakdown'
import { ClosePopupAction } from '../../../popups/actions'
import { usePopupStore } from '../../../store/usePopupStore'
import { showAddress, showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'

export function TradeBreakdownBubble ({ contract }: { contract: Contract }) {
  const setPopup = usePopupStore((state) => state.setPopup)
  const viewInExplorer = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)
  const showTradeBreakdown = () => {
    setPopup(
      <PopupComponent
        title={i18n('tradeComplete.popup.tradeBreakdown.title')}
        content={<TradeBreakdown {...contract} />}
        actions={
          <>
            <ClosePopupAction />
            <PopupAction
              label={i18n('tradeComplete.popup.tradeBreakdown.explorer')}
              onPress={viewInExplorer}
              iconId="externalLink"
              reverseOrder
            />
          </>
        }
      />,
    )
  }

  return (
    <Bubble iconId="info" color="primary" onPress={showTradeBreakdown}>
      {i18n('contract.summary.tradeBreakdown.show')}
    </Bubble>
  )
}
