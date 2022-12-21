import React, { ReactElement } from 'react'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export default (): ReactElement => <Text style={tw`subtitle-1`}>{i18n('settings.networkFees.custom')}</Text>
