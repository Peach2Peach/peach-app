import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const ReferralsHelp = () => (
  <>
    <PeachText style={tw`mb-2`}>{i18n('help.referral.description.1')}</PeachText>
    <PeachText>{i18n('help.referral.description.2')}</PeachText>
  </>
)
