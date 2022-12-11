import React, { ReactElement } from 'react'
import { account } from '../utils/account'
import { ConfirmCancelTradeBuyer } from './tradeCancelation/ConfirmCancelTradeBuyer'
import { ConfirmCancelTradeSeller } from './tradeCancelation/ConfirmCancelTradeSeller'

/**
 * @description Overlay the user sees when requesting cancelation
 */
export type ConfirmCancelTradeProps = {
  contract: Contract
}
export const ConfirmCancelTrade = (props: ConfirmCancelTradeProps): ReactElement =>
  props.contract.seller.id === account.publicKey ? (
    <ConfirmCancelTradeSeller {...props} />
  ) : (
    <ConfirmCancelTradeBuyer {...props} />
  )
