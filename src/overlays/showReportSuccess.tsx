import { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Text } from '../components'
import i18n from '../utils/i18n'

const ReportSuccess = (): ReactElement => (
  <View>
    <Text style={tw`my-2`}>{i18n('report.success.text.1')}</Text>
    <Text>{i18n('report.success.text.2')}</Text>
  </View>
)

export const showReportSuccess = (updateOverlay: Function) => {
  updateOverlay({
    title: i18n('report.success.title'),
    content: <ReportSuccess />,
    visible: true,
    level: 'APP',
  })
}
