import { ReactElement } from 'react';
import { Linking } from 'react-native'
import { Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const AnalyticsPrompt = (): ReactElement => (
  <Text>
    {i18n('analytics.request.description1')}
    {'\n\n'}
    {i18n('analytics.request.description2')}
    <Text
      style={tw`mt-2 text-center underline`}
      onPress={() => Linking.openURL('https://www.peachbitcoin.com/privacyPolicy.html')}
    >
      {i18n('privacyPolicy').toLocaleLowerCase()}.
    </Text>
    {'\n\n'}
    {i18n('analytics.request.description3')}
  </Text>
)
