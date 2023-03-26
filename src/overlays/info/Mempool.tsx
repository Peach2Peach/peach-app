import { ReactElement } from 'react';

import { Text } from '../../components'
import i18n from '../../utils/i18n'

export const Mempool = (): ReactElement => <Text>{i18n('help.mempool.description')}</Text>
