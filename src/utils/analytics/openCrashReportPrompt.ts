import { Alert } from 'react-native'
import i18n, { languageState } from '../i18n'
import { getLocalizedLink } from '../web/getLocalizedLink'
import { openURL } from '../web/openURL'
import { deleteUnsentReports } from './deleteUnsentReports'
import { sendErrors } from './sendErrors'

export const openCrashReportPrompt = (errors: Error[]): void => {
  Alert.alert(
    i18n('crashReport.requestPermission.title'),
    [i18n('crashReport.requestPermission.description.1'), i18n('crashReport.requestPermission.description.2')].join(
      '\n\n',
    ),
    [
      {
        text: i18n('privacyPolicy'),
        onPress: () => {
          openCrashReportPrompt(errors)
          openURL(getLocalizedLink('privacy-policy', languageState.locale))
        },
        style: 'default',
      },
      {
        text: i18n('crashReport.requestPermission.deny'),
        onPress: deleteUnsentReports,
        style: 'default',
      },
      {
        text: i18n('crashReport.requestPermission.sendReport'),
        onPress: () => sendErrors(errors),
        style: 'default',
      },
    ],
  )
}
