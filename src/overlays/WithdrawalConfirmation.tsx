import { ReactElement } from 'react'
import { Text } from '../components'
import i18n from '../utils/i18n'

export const WithdrawalConfirmation = (): ReactElement => <Text>{i18n('wallet.confirmWithdraw.text')}</Text>
