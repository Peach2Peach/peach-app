import React, { ReactElement } from 'react'

import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const Premium = (): ReactElement => <Text>{i18n('help.premium.description')}</Text>
