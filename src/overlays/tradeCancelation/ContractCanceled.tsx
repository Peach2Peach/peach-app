import React, { ReactElement } from 'react'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

type ContractCanceledProps = {
  contract: Contract
}
export const ContractCanceled = ({ contract }: ContractCanceledProps): ReactElement => (
  <Text>{i18n(`contract.cancel.${contract.canceledBy || 'buyer'}.canceled.text`)}</Text>
)
