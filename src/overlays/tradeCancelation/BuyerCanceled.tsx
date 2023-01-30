import React, { ReactElement } from 'react'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const BuyerCanceled = (): ReactElement => <Text>{i18n('contract.cancel.buyerCanceled.text')}</Text>
