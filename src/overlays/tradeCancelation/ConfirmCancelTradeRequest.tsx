import React, { ReactElement } from 'react'
import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'

type ConfirmCancelTradeRequestProps = {
  contract: Contract
}

export const ConfirmCancelTradeRequest = ({ contract }: ConfirmCancelTradeRequestProps): ReactElement => (
  <Text>
    {i18n('contract.cancel.sellerWantsToCancel.text', contractIdToHex(contract.id), thousands(contract.amount))}
  </Text>
)
