import { ReactElement } from 'react'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const WithdrawingFundsHelp = (): ReactElement => <Text>{i18n('wallet.withdraw.help.text')}</Text>
