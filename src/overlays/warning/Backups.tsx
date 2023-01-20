import React, { ReactElement } from 'react'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const Backups = (): ReactElement => <Text>{i18n('warning.backup.description')}</Text>
