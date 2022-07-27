import React, { ReactElement } from 'react'

import { account } from '../utils/account'
import { StackNavigation } from '../utils/navigation'
import { ConfirmCancelTradeBuyer } from './tradeCancelation/ConfirmCancelTradeBuyer'
import { ConfirmCancelTradeSeller } from './tradeCancelation/ConfirmCancelTradeSeller'

export type ConfirmCancelTradeProps = {
  contract: Contract,
  navigation: StackNavigation
}

export default ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const view = contract.seller.id === account.publicKey ? 'seller' : 'buyer'

  return view === 'seller'
    ? <ConfirmCancelTradeSeller contract={contract} navigation={navigation} />
    : <ConfirmCancelTradeBuyer contract={contract} navigation={navigation} />
}