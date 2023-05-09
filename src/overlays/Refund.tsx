import { ReactElement } from 'react'
import { PeachText } from '../components/text/Text'
import i18n from '../utils/i18n'

type Props = {
  isPeachWallet: boolean
}
export const Refund = ({ isPeachWallet }: Props): ReactElement => (
  <PeachText>{i18n(isPeachWallet ? 'refund.text.peachWallet' : 'refund.text.externalWallet')}</PeachText>
)
