import { ReactElement } from 'react';
import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'

type PaymentTimerHasRunOutProps = {
  contract: Contract
}
export const PaymentTimerHasRunOut = ({ contract }: PaymentTimerHasRunOutProps): ReactElement => (
  <Text>{i18n('contract.seller.paymentTimerHasRunOut.text', contractIdToHex(contract.id))}</Text>
)
