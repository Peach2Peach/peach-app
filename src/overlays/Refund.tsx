import { Text } from '../components'
import i18n from '../utils/i18n'

type Props = {
  isPeachWallet: boolean
}
export const Refund = ({ isPeachWallet }: Props) => (
  <Text>{i18n(isPeachWallet ? 'refund.text.peachWallet' : 'refund.text.externalWallet')}</Text>
)
