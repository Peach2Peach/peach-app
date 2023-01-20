import React, { ReactElement } from 'react'

import { Text } from '../components'
import i18n from '../utils/i18n'

export const ConfirmCancelOffer = (): ReactElement => <Text>{i18n('offer.cancel.popup.description')}</Text>
