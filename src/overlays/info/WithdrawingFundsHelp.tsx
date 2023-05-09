import { ReactElement } from 'react'
import { PeachText } from '../../components/text/Text'
import i18n from '../../utils/i18n'

export const WithdrawingFundsHelp = (): ReactElement => <PeachText>{i18n('wallet.withdraw.help.text')}</PeachText>
