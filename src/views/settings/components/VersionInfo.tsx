import React from 'react'
import { Text } from '../../../components'
import { APPVERSION, BUILDNUMBER } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const VersionInfo = ({ style }: ComponentProps) => (
  <Text style={[tw`button-medium text-black-3 uppercase`, style]}>
    {i18n('settings.peachApp')}
    {APPVERSION} ({BUILDNUMBER})
  </Text>
)
