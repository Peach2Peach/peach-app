import { ReactElement } from 'react'
import { PeachText } from '../../components/text/Text'
import i18n from '../../utils/i18n'

export const TradingLimit = (): ReactElement => <PeachText>{i18n('help.tradingLimit.description')}</PeachText>
