import PeachText from '../components/text/Text'
import tw from '../styles/tailwind'
import i18n, { languageState } from '../utils/i18n'
import { getLocalizedLink } from '../utils/web/getLocalizedLink'
import { openURL } from '../utils/web/openURL'

export const AnalyticsPrompt = () => (
  <PeachText>
    {i18n('analytics.request.description1')}
    {'\n\n'}
    {i18n('analytics.request.description2')}
    <PeachText
      style={tw`mt-2 text-center underline`}
      onPress={() => openURL(getLocalizedLink('privacy-policy', languageState.locale))}
    >
      {i18n('privacyPolicy').toLocaleLowerCase()}.
    </PeachText>
    {'\n\n'}
    {i18n('analytics.request.description3')}
  </PeachText>
)
