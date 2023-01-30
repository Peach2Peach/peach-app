import React, { ReactElement } from 'react'

import { Text } from '../components'
import i18n from '../utils/i18n'

type RefundProps = {
  isPeachWallet: boolean
}
export default ({ isPeachWallet }: RefundProps): ReactElement => (
  <Text>{i18n(isPeachWallet ? 'refund.text.peachWallet' : 'refund.text.externalWallet')}</Text>
)
