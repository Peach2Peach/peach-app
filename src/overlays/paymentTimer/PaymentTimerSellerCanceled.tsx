import React, { ReactElement } from 'react'
import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'

type PaymentTimerSellerCanceledProps = {
  contract: Contract
}
export const PaymentTimerSellerCanceled = ({ contract }: PaymentTimerSellerCanceledProps): ReactElement => (
  <Text>{i18n('contract.buyer.paymentTimerSellerCanceled.text', contractIdToHex(contract.id))}</Text>
)
