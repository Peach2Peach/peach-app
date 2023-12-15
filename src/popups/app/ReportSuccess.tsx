import { View } from 'react-native'
import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const ReportSuccess = () => (
  <View>
    <PeachText style={tw`my-2`}>{i18n('report.success.text.1')}</PeachText>
    <PeachText>{i18n('report.success.text.2')}</PeachText>
  </View>
)
