import React, { ReactElement } from 'react'
import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'

type CancelTradeRequestRejectedProps = {
  contract: Contract
}
export const CancelTradeRequestRejected = ({ contract }: CancelTradeRequestRejectedProps): ReactElement => (
  <Text>{i18n('contract.cancel.buyerRejected.text', contractIdToHex(contract.id), thousands(contract.amount))}</Text>
)
