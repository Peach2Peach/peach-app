import React from 'react'
import { Text } from '../../../components'
import { APPVERSION, BUILDNUMBER } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const VersionInfo = () => (
  <Text style={tw`text-center text-sm text-peach-mild mt-10`}>
    {i18n('settings.peachApp')}
    {APPVERSION} ({BUILDNUMBER})
  </Text>
)
