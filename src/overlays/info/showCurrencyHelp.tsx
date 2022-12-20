import React, { ReactElement } from 'react'

import { Text } from '../../components'
import i18n from '../../utils/i18n'

const CurrencyHelp = (): ReactElement => <Text>{i18n('help.currency.description')}</Text>

export const showCurrencyHelp = (updateOverlay: Function, goToHelp: Function) => {
  updateOverlay({
    title: i18n('help.currency.title'),
    content: <CurrencyHelp />,
    visible: true,
    level: 'INFO',
    action2: {
      callback: goToHelp,
      label: i18n('help'),
      icon: 'info',
    },
  })
}
