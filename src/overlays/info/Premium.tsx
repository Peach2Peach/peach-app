import { ReactElement } from 'react'
import { PeachText } from '../../components/text/Text'
import i18n from '../../utils/i18n'

export const Premium = (): ReactElement => <PeachText>{i18n('help.premium.description')}</PeachText>
