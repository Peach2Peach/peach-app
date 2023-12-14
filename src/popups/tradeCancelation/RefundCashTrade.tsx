import PeachText from '../../components/text/Text'
import i18n from '../../utils/i18n'

export const RefundCashTrade = ({ tradeID, walletName }: { tradeID: string; walletName: string }) => (
  <PeachText>{i18n('contract.cancel.cash.tradeCanceled.text', tradeID, walletName)}</PeachText>
)
