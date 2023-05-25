import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const RefundCashTrade = ({ tradeID, walletName }: { tradeID: string; walletName: string }) => (
  <Text>{i18n('contract.cancel.cash.tradeCanceled.text', tradeID, walletName)}</Text>
)
