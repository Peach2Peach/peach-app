import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'

type Props = { contract: Pick<Contract, 'id'> }
export const PaymentTimerHasRunOut = ({ contract }: Props) => (
  <Text>{i18n('contract.seller.paymentTimerHasRunOut.text', contractIdToHex(contract.id))}</Text>
)
