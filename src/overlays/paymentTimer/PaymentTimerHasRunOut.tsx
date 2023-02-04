import React, { ReactElement } from 'react'
import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'

type PaymentTimerHasRunOutProps = {
  contract: Contract
  view: ContractViewer
}
export const PaymentTimerHasRunOut = ({ contract, view }: PaymentTimerHasRunOutProps): ReactElement => (
  <Text>{i18n(`contract.${view}.paymentTimerHasRunOut.text`, contractIdToHex(contract.id))}</Text>
)
