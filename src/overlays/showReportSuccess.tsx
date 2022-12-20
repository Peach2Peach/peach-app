import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { account } from '../utils/account'
import { useNavigation } from '../hooks'

const ReportSuccess = (): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }

  const goToHome = () => {
    navigation.replace(account?.publicKey ? 'home' : 'welcome')
    closeOverlay()
  }
  return (
    <View>
      <Text style={tw`my-2`}>{i18n('report.success.text.1')}</Text>
      <Text>{i18n('report.success.text.2')}</Text>
    </View>
  )
}

export const showReportSuccess = (updateOverlay: Function) => {
  updateOverlay({
    title: i18n('report.success.title'),
    content: <ReportSuccess />,
    visible: true,
    level: 'APP',
  })
}
