import React from 'react'
import { Text } from '../../../components'
import { APPVERSION, BUILDNUMBER } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const VersionInfo = () => (
  <Text style={tw`text-center button-medium text-black-3 mt-9 mb-10 uppercase`}>
    {i18n('settings.peachApp')}
    {APPVERSION} ({BUILDNUMBER})
  </Text>
)
