import { Linking } from 'react-native'
import { Text } from '../components'
import tw from '../styles/tailwind'
import i18n, { languageState } from '../utils/i18n'
import { getLocalizedLink } from '../utils/web'

export const AnalyticsPrompt = () => (
  <Text>
    {i18n('analytics.request.description1')}
    {'\n\n'}
    {i18n('analytics.request.description2')}
    <Text
      style={tw`mt-2 text-center underline`}
      onPress={() => Linking.openURL(getLocalizedLink('privacy-policy', languageState.locale))}
    >
      {i18n('privacyPolicy').toLocaleLowerCase()}.
    </Text>
    {'\n\n'}
    {i18n('analytics.request.description3')}
  </Text>
)
