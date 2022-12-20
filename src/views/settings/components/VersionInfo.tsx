import React from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { Text } from '../../../components'
import { APPVERSION, BUILDNUMBER } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const VersionInfo = ({ style, ...props }: { style?: StyleProp<TextStyle> } & ComponentProps) => (
  <Text style={[tw`button-medium text-black-3 uppercase`, style]} {...props}>
    {i18n('settings.peachApp')}
    {APPVERSION} ({BUILDNUMBER})
  </Text>
)
