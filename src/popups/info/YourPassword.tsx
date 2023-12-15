import { View } from 'react-native'
import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const YourPassword = () => (
  <>
    <PeachText>{i18n('settings.backups.fileBackup.popup2.content.1')}</PeachText>

    <PeachText style={tw`mt-3`}>{i18n('settings.backups.fileBackup.popup2.content.2')}</PeachText>

    <View style={tw`pl-1 my-3`}>
      <PeachText>{i18n('settings.backups.fileBackup.popup2.content.3')}</PeachText>
      <PeachText>{i18n('settings.backups.fileBackup.popup2.content.4')}</PeachText>
      <PeachText>{i18n('settings.backups.fileBackup.popup2.content.5')}</PeachText>
    </View>

    <PeachText style={tw`font-bold`}>{i18n('settings.backups.fileBackup.popup2.content.6')}</PeachText>
  </>
)
