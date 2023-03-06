import React, { ReactElement } from 'react'

import { Text } from '../../components'
import i18n from '../../utils/i18n'

export default (): ReactElement => <Text>{i18n('help.paymentMethodDelete.description')}</Text>
