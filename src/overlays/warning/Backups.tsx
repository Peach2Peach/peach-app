import { ReactElement } from 'react';
import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const FirstBackup = (): ReactElement => <Text>{i18n('warning.firstBackup.description')}</Text>
export const PaymentBackup = (): ReactElement => <Text>{i18n('warning.paymentBackup.description')}</Text>
