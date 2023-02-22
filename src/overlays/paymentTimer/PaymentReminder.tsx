import React, { ReactElement } from 'react'
import { Text } from '../../components'
import { contractIdToHex, getPaymentExpectedBy } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { round } from '../../utils/math'

const ONEHOURINMS = 3600000

type PaymentReminderProps = {
  contract: Contract
}
export const PaymentReminder = ({ contract }: PaymentReminderProps): ReactElement => {
  const hours = round((getPaymentExpectedBy(contract) - Date.now()) / ONEHOURINMS)
  return <Text>{i18n('contract.buyer.paymentReminder.text', contractIdToHex(contract.id), String(hours))}</Text>
}
