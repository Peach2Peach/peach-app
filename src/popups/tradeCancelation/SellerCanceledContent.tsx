import { RequestSent } from './RequestSent'
import { RefundOrRepublishCashTrade } from './RefundOrRepublishCashTrade'
import { RefundCashTrade } from './RefundCashTrade'

type Props = {
  isCash: boolean
  canRepublish: boolean
  tradeID: string
  walletName: string
}

export const SellerCanceledContent = ({ isCash, canRepublish, ...refundCashProps }: Props) =>
  isCash ? canRepublish ? <RefundOrRepublishCashTrade /> : <RefundCashTrade {...refundCashProps} /> : <RequestSent />
