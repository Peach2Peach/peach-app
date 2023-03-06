import React, { ReactElement } from 'react'
import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'

type PaymentTimerExtendedProps = {
  contract: Contract
}
export const PaymentTimerExtended = ({ contract }: PaymentTimerExtendedProps): ReactElement => (
  <Text>{i18n('contract.buyer.paymentTimerExtended.text', contractIdToHex(contract.id))}</Text>
)
