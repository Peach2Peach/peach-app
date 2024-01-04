import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const SeedPhrasePopup = () => (
  <PeachText style={tw`body-m`}>
    {i18n('settings.backups.seedPhrase.popup.text.1')}
    {'\n\n'}
    <PeachText style={tw`font-bold`}>{i18n('settings.backups.seedPhrase.popup.text.2')}</PeachText>
  </PeachText>
)
