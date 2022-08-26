import React, { ReactElement, useContext } from 'react'
import { MessageContext } from '../contexts/message'
import { OverlayContext } from '../contexts/overlay'
import { account } from '../utils/account'
import { Navigation } from '../utils/navigation'
import { ConfirmCancelTradeBuyer } from './tradeCancelation/ConfirmCancelTradeBuyer'
import { ConfirmCancelTradeSeller } from './tradeCancelation/ConfirmCancelTradeSeller'

/**
 * @description Overlay the user sees when requesting cancelation
 */

export type ConfirmCancelTradeProps = {
  contract: Contract,
  navigation: Navigation
}
export const ConfirmCancelTrade = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  return contract.seller.id === account.publicKey
    ? <ConfirmCancelTradeSeller contract={contract} navigation={navigation}/>
    : <ConfirmCancelTradeBuyer contract={contract} navigation={navigation}/>
}