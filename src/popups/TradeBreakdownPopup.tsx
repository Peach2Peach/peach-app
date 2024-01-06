import { NETWORK } from '@env'
import { PopupAction } from '../components/popup/PopupAction'
import { PopupComponent } from '../components/popup/PopupComponent'
import { showAddress } from '../utils/bitcoin/showAddress'
import { showTransaction } from '../utils/bitcoin/showTransaction'
import i18n from '../utils/i18n'
import { TradeBreakdown } from './TradeBreakdown'
import { ClosePopupAction } from './actions/ClosePopupAction'

export function TradeBreakdownPopup ({ contract }: { contract: Contract }) {
  const viewInExplorer = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)
  return (
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
    />
  )
}
