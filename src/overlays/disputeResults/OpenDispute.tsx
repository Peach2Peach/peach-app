import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const OpenDispute = (): ReactElement => (
  <>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.openDispute.text.1')}</Text>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.openDispute.text.2')}</Text>
    <Text style={tw`body-m text-black-1`}>{i18n('dispute.openDispute.text.3')}</Text>
  </>
)
