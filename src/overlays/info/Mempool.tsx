import { ReactElement } from 'react'
import { PeachText } from '../../components/text/Text'
import i18n from '../../utils/i18n'

export const Mempool = (): ReactElement => <PeachText>{i18n('help.mempool.description')}</PeachText>
