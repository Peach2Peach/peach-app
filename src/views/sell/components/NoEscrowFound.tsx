import React, { ReactElement } from 'react'

import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement => <Text style={tw`text-center`}>{i18n('escrowNotFound')}</Text>
