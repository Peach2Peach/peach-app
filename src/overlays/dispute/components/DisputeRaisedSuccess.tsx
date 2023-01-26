import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement => (
  <>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.raised.text')}</Text>
  </>
)
