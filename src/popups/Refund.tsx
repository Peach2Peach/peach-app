import { PeachText } from '../components/text/PeachText'
import i18n from '../utils/i18n'

type Props = {
  isPeachWallet: boolean
}
export const Refund = ({ isPeachWallet }: Props) => (
  <PeachText>{i18n(isPeachWallet ? 'refund.text.peachWallet' : 'refund.text.externalWallet')}</PeachText>
)
